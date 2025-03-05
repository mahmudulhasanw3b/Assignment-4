import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
    constructor(
        public modelQuery: Query<T[], T>,
        public query: Record<string, unknown>,
    ) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    filter() {
        const queryObj: Record<string, unknown> = { ...this?.query }; //copy
        const excludeFields: Array<string> = [
            'sortBy',
            'sortOrder',
            'limit',
            'page',
            'tags',
            'minPrice',
            'maxPrice',
            'startDate',
            'endDate',
            'level',
        ];
        if (this?.query?.tags) {
            queryObj['tags.name'] = this.query?.tags;
        }
        if (this?.query?.level) {
            queryObj['details.level'] = this.query?.level;
        }
        excludeFields.forEach((el) => delete queryObj[el]);
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }

    sort() {
        const sortBy: string = (this?.query?.sortBy as string) || 'createdAt';
        const sortOrder: string = (this?.query?.sortOrder as string) || 'asc';
        const sort: string = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    paginate() {
        const page: number = parseInt(this?.query?.page as string) || 1;
        const limit: number = parseInt(this?.query?.limit as string) || 10;
        const skip: number = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    price() {
        const minPrice: number = Number(this?.query?.minPrice as string) || 0;
        const maxPrice: number =
            Number(this?.query?.maxPrice as string) || Infinity;

        this.modelQuery = this.modelQuery.find({
            price: {
                $lte: maxPrice,
                $gte: minPrice,
            },
        });
        return this;
    }

    date() {
        const startDate = new Date(this?.query?.startDate as Date);
        const endDate = new Date(this?.query?.endDate as Date);

        const filter: {
            startDate?: FilterQuery<T>;
            endDate?: FilterQuery<T>;
        } = {};

        if (this?.query?.startDate) {
            filter.startDate = { $gt: startDate };
        }

        if (this?.query?.endDate) {
            filter.endDate = { $lt: endDate };
        }

        this.modelQuery = this.modelQuery.find(filter);

        return this;
    }

    async totalCount() {
        const totalQueries = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(totalQueries);

        const limit: number = parseInt(this?.query?.limit as string) || 10;
        const page: number =
            parseInt(this?.query?.page as string) && limit
                ? parseInt(this?.query?.page as string)
                : 1;

        return {
            page,
            limit,
            total,
        };
    }
}

export default QueryBuilder;
