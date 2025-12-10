// service.js
import { MongoClient } from 'mongodb';
import DatabaseFind from "./services.database";
import { ItemCreate } from "./services-utilities";
import { getMongoClient } from '@/lib/mongo-pool';

let db; // cache the collection

// database connect
const mndb = (await DatabaseFind('documents')).data
const client = new MongoClient(mndb.urim);
const dbse = client.db(mndb.dbse).collection(mndb.dbcc);



export const addRecord = async (body) => {

    const { data, srvc } = body;
    const trxn = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    try {
        const mndb = (await DatabaseFind('documents')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);


        const record = data?.record;
        if (!record || !record.sections?.length) {
            return {
                stat: false,
                code: '400',
                message: "Missing or invalid record data",
                data: null,
                trxn,
                srvc: srvc || 'web-client'
            };
        }

        // Extract name_of_post from Meta Details section
        const metaSection = record.sections?.find(s =>
            s.title?.toLowerCase().includes('meta')
        );
        const titleField = metaSection?.elements?.find(f =>
            f.name === 'title'
        );
        const descriptionField = metaSection?.elements?.find(f =>
            f.name === 'description'
        );
        const titleRaw = titleField?.value;
        const description = descriptionField?.value;
        if (!titleRaw || !description) {
            return {
                stat: false,
                code: '422',
                message: "Missing 'title' or 'description' field in meta section",
                data: null,
                trxn,
                srvc: srvc || 'web-client'
            };
        }


        const titleSlug = titleRaw
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        record.title_slug = titleSlug;
        record.title = titleRaw;
        record.description = description;
        record.unique_id = ItemCreate();
        record.active = true;
        record.inserted = Date.now().toString();


        const result = await dbse.insertOne(record);

        return {
            stat: true,
            code: '201',
            message: "Record created successfully",
            data: {
                insertedId: result.insertedId,
                title_slug: record.title_slug,
                unique_id: record.unique_id
            },
            trxn,
            srvc: srvc || 'web-client'
        };

    } catch (error) {
        console.error(error);
        return {
            stat: false,
            code: '500',
            message: error.message || "Server error",
            data: null,
            trxn,
            srvc: srvc || 'web-client'
        };
    }
}

export const deleteRecord = async (body) => {
    const { data, srvc } = body;
    const { unique_id } = data;

    if (!unique_id) {
        return {
            data: null,
            memo: "Missing unique_id parameter",
            stat: false,
            trxn: "******",
            srvc: srvc || "******"
        };
    }

    try {
        const mndb = (await DatabaseFind('documents')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        const existingRecord = await dbse.findOne({ unique_id });

        if (!existingRecord) {
            return {
                data: null,
                memo: "Record not found",
                stat: false,
                trxn: "******",
                srvc: srvc || "******"
            };
        }

        const result = await dbse.updateOne(
            { unique_id },
            { $set: { active: false, updated: Date.now().toString() } }
        );

        if (result.modifiedCount === 1) {
            return {
                data: { unique_id },
                memo: "Record marked as inactive successfully",
                stat: true,
                trxn: "******",
                srvc: srvc || "******"
            };
        } else {
            return {
                data: null,
                memo: "No changes made to the record",
                stat: false,
                trxn: "******",
                srvc: srvc || "******"
            };
        }

    } catch (error) {
        return {
            data: null,
            memo: error.message || "Server error",
            stat: false,
            trxn: "******",
            srvc: srvc || "******"
        };
    }
};


export const getAllSlugs = async ({ data = {}, srvc }) => {

    const trxn = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    try {
        const { searchTerm = "", index = 1, items = 1000, category } = data;
        const skip = (parseInt(index) - 1) * parseInt(items);
        const limit = parseInt(items);
        const sort = { updated: -1, inserted: -1 }

        const filters = [{ active: true }];
        let orCondition = [];
        switch (category) {
            case 'latest-jobs':
                orCondition.push({ 'show.jobs': true })
                break;
            case 'result':
                orCondition.push({ 'show.results': true })
                break;
            case 'answer-key':
                orCondition.push({ 'show.answerKey': true })
                break;
            case 'syllabus':
                orCondition.push({ 'show.syllabus': true })
                break
            case 'admission':
                orCondition.push({ 'show.admission': true })
                break
            case 'admit-cards':
                orCondition.push({ 'show.admitCard': true })
                break
            case 'documents':
                orCondition.push({ 'show.documents': true })
                break
            case 'sarkari-yojna':
                orCondition.push({ 'show.sarkariYojna': true })
                break
            case 'offline-form':
                orCondition.push({ 'show.offlineForm': true })
                break
            case 'upcoming':
                orCondition.push({ 'show.upcoming': true })
                break
        }
        if (orCondition.length > 0) {
            orCondition.push({ category: category })
            filters.push({ $or: orCondition });
        }

        // Raw records query
        const mndb = (await DatabaseFind('documents')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        const rawRecords = await dbse?.find({ $and: filters }, { _id: 0, title_slug: 1 })
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .toArray();

        const records = rawRecords?.map(item => item.title_slug)

        return {
            stat: true,
            code: '200',
            message: `${records.length} record(s) found`,
            data: {
                list: records,
                // count: count.toString(),
                // index: index.toString(),
                // items: items.toString()
            },
            trxn,
            srvc: srvc || "web-client"
        };

    } catch (error) {
        return {
            stat: false,
            code: '500',
            message: error.message || "Server error",
            data: { list: [] },
            trxn,
            srvc: srvc || "web-client"
        };
    }
};

export const getAllRecords = async ({ data = {}, srvc }) => {

    const trxn = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    try {
        const mndb = (await DatabaseFind('documents')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        const { searchTerm = "", index = 1, items = 24, categories = [] } = data;

        const skip = (parseInt(index) - 1) * parseInt(items);
        const limit = parseInt(items);
        const sort = { updated: -1, inserted: -1 }

        const filters = [{ active: true }];

        let orCondition = [];
        if (categories?.length > 0) {
            if (categories.includes('result')) {
                orCondition.push({ category: 'result' })
                orCondition.push({ 'show.results': true })
            }
            if (categories.includes('answer-key')) {
                orCondition.push({ category: 'answer-key' })
                orCondition.push({ 'show.answerKey': true })
            }
            if (categories.includes('latest-jobs')) {
                orCondition.push({ category: 'latest-jobs' })
                orCondition.push({ 'show.jobs': true })
            }
            if (categories.includes('syllabus')) {
                orCondition.push({ category: 'syllabus' })
                orCondition.push({ 'show.syllabus': true })
            }
            if (categories.includes('admission')) {
                orCondition.push({ category: 'admission' })
                orCondition.push({ 'show.admission': true })
            }
            if (categories.includes('admit-cards')) {
                orCondition.push({ category: 'admit-cards' })
                orCondition.push({ 'show.admitCard': true })
            }
            if (categories.includes('important')) {
                orCondition.push({ 'show.important': true })
            }
            if (categories.includes('new')) {
                orCondition.push({ 'show.new': true })
            }
            if (categories.includes('hidden')) {
                orCondition.push({ 'show.hidden': true })
            }
            if (categories.includes('documents')) {
                orCondition.push({ category: 'documents' })
                orCondition.push({ 'show.documents': true })
            }
            if (categories.includes('sarkari-yojna')) {
                orCondition.push({ category: 'sarkari-yojna' })
                orCondition.push({ 'show.sarkariYojna': true })
            }
            if (categories.includes('offline-form')) {
                orCondition.push({ category: 'offline-form' })
                orCondition.push({ 'show.offlineForm': true })
            }
            if (categories.includes('upcoming')) {
                orCondition.push({ category: 'upcoming' })
                orCondition.push({ 'show.upcoming': true })
            }
            if (orCondition?.length > 0) filters.push({ $or: orCondition });
        } else {
            filters.push({ 'show.hidden': { $ne: true } })
        }

        if (searchTerm?.trim()) {
            const term = searchTerm.trim();
            filters.push({
                $or: [
                    { title_slug: { $regex: `.*${term}.*`, $options: 'i' } },
                    {
                        sections: {
                            $elemMatch: {
                                elements: {
                                    $elemMatch: {
                                        name: "title",
                                        value: { $regex: `.*${term}.*`, $options: 'i' }
                                    }
                                }
                            }
                        }
                    }
                ]
            });
        }

        const values = { _id: 0, title: 1, title_slug: 1, description: 1, unique_id: 1, inserted: 1, updated: 1, pendingForm: 1, category: 1, show: 1 }

        // Raw records query
        const rawRecords = await dbse?.find({ $and: filters }, { projection: values })
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .toArray();

        const records = await Promise.all(
            rawRecords.map(async (record) => {

                const flat = {
                    title_slug: record.title_slug,
                    title: record.title,
                    description: record.description,
                    unique_id: record.unique_id,
                    pendingForm: record.pendingForm,
                    category: record.category,
                    show: Object?.entries(record?.show)?.reduce((acc, [key, value]) => {
                        if (value === true) acc[key] = true;
                        return acc;
                    }, {}
                    ),
                    updated: record.updated?.toString() || null,
                    uploaded: (record.inserted)?.toString() || null
                };

                return flat;
            })
        );


        const count = await dbse.countDocuments({ $and: filters });

        return {
            stat: true,
            code: '200',
            message: `${records.length} record(s) found`,
            data: {
                list: records,
                count: count.toString(),
                index: index.toString(),
                items: items.toString()
            },
            trxn,
            srvc: srvc || "web-client"
        };

    } catch (error) {
        return {
            stat: false,
            code: '500',
            message: error.message || "Server error",
            data: { list: [] },
            trxn,
            srvc: srvc || "web-client"
        };
    }
};

export const getCategoryRecords = async (body) => {
    const { data, srvc } = body
    const trxn = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    try {
        const mndb = (await DatabaseFind('documents')).data;
        if (!client.isConnected?.()) {
            console.log('Making new connection')
            await client.connect();
        }
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        const { category, searchTerm = "", index = 1, items = 24, exclude = null } = data;
        if (!category) return {
            stat: false,
            code: '400',
            message: "Bad value! category required",
            data: [],
            trxn,
            srvc: srvc || "web-client"
        };

        const filters = [{ active: true }, { 'show.hidden': { $ne: true } }];
        if (!(category == 'upcoming')) filters.push({ 'show.upcoming': { $ne: true } })
        if (exclude) filters.push({ unique_id: { $ne: exclude } })
        if (exclude) filters.push({ 'show.new': true })
        let orCondition = [{ category: category }];
        switch (category) {
            case 'latest-jobs':
                orCondition.push({ 'show.jobs': true })
                break;
            case 'result':
                orCondition.push({ 'show.results': true })
                break;
            case 'answer-key':
                orCondition.push({ 'show.answerKey': true })
                break;
            case 'syllabus':
                orCondition.push({ 'show.syllabus': true })
                break
            case 'admission':
                orCondition.push({ 'show.admission': true })
                break
            case 'admit-cards':
                orCondition.push({ 'show.admitCard': true })
                break
            case 'documents':
                orCondition.push({ 'show.documents': true })
                break
            case 'sarkari-yojna':
                orCondition.push({ 'show.sarkariYojna': true })
                break
            case 'offline-form':
                orCondition.push({ 'show.offlineForm': true })
                break
            case 'upcoming':
                orCondition.push({ 'show.upcoming': true })
                break
            case 'new':
                orCondition.push({ 'show.new': true })
                break
        }

        if (orCondition.length > 0) {
            filters.push({ $or: orCondition });
        }


        if (searchTerm?.trim()) {
            const term = escapeRegex(searchTerm.trim());
            filters.push({
                $or: [{
                    sections: {
                        $elemMatch: {
                            elements: {
                                $elemMatch: {
                                    name: "title",
                                    value: { $regex: `.*${term}.*`, $options: 'i' }
                                }
                            }
                        }
                    }
                }, { title_slug: { $regex: `.*${term}.*`, $options: 'i' } }]
            });
        }

        const skip = (parseInt(index) - 1) * parseInt(items);
        const limit = parseInt(items);

        const values = { _id: 0, title: 1, title_slug: 1, description: 1, unique_id: 1, pendingForm: 1, category: 1, show: 1 }
        const sort = { 'show.new': -1 }
        if (category == 'latest-jobs' || category == 'result' || category == 'admission' || category == 'admit-cards' || category == 'answer-key') sort['updated'] = -1

        sort['inserted'] = -1
        // Raw records query

        const rawRecords = await dbse?.find({ $and: filters }, { projection: values })
            .skip(skip)
            .limit(limit)
            .sort(sort) //updated: -1, 'show.new':-1,
            .toArray();
        // return rawRecords
        const records = await Promise.all(
            rawRecords.map(async (record) => {

                const flat = {
                    title_slug: record.title_slug,
                    title: record.title,
                    description: record.description,
                    unique_id: record.unique_id,
                    pendingForm: record.pendingForm,
                    category: record.category,
                    show: Object?.entries(record?.show)?.reduce((acc, [key, value]) => {
                        if (value === true) acc[key] = true;
                        return acc;
                    }, {}
                    ),
                    updated: record.updated || null,
                    // post_date: null,
                    // name_of_organisation: null,
                    // title: null,
                    // description: null
                };

                // for (const section of record.sections || []) {
                //   for (const element of section.elements || []) {
                //     if (element.name === 'title' && !flat.title) flat.title = element.value;
                //     if (element.name === 'post_date' && !flat.post_date) flat.post_date = element.value;
                //     if (element.name === 'name_of_organisation' && !flat.name_of_organisation) flat.name_of_organisation = element.value;
                //     if (element.name === 'description' && !flat.description) flat.description = element.value;
                //   }
                // }

                return flat;
            })
        );

        const count = await dbse.countDocuments({ $and: filters });

        return {
            stat: true,
            code: '200',
            message: `${records.length} record(s) found`,
            data: {
                list: records,
                count: count.toString(),
                index: index.toString(),
                items: items.toString()
            },
            trxn,
            srvc: srvc || "web-client"
        };

    } catch (error) {
        return {
            stat: false,
            code: '500',
            message: error.message || "Server error",
            data: { list: [] },
            trxn,
            srvc: srvc || "web-client"
        };
    }
};


export const getFilteredRecords = async (body) => {
    const { data, srvc } = body;
    const trxn = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    try {
        const mndb = (await DatabaseFind('documents')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        const { category, searchTerm = "", index = 1, items = 24 } = data;
        if (!category)
            return {
                stat: false,
                code: "400",
                message: "Bad value! category required",
                data: [],
                trxn,
                srvc: srvc || "web-client",
            };

        const filters = [
            { active: true },
            { "show.hidden": { $ne: true } },

        ];
        if (!(category == "upcoming"))
            filters.push({ "show.upcoming": { $ne: true } });
        let orCondition = [{ category: "latest-jobs" }];
        const categoryx = "latest-jobs";
        switch (categoryx) {
            case "latest-jobs":
                orCondition.push({ "show.jobs": true });
                break;
            case "result":
                orCondition.push({ "show.results": true });
                break;
            case "answer-key":
                orCondition.push({ "show.answerKey": true });
                break;
            case "syllabus":
                orCondition.push({ "show.syllabus": true });
                break;
            case "admission":
                orCondition.push({ "show.admission": true });
                break;
            case "admit-cards":
                orCondition.push({ "show.admitCard": true });
                break;
            case "documents":
                orCondition.push({ "show.documents": true });
                break;
            case "sarkari-yojna":
                orCondition.push({ "show.sarkariYojna": true });
                break;
            case "offline-form":
                orCondition.push({ "show.offlineForm": true });
                break;
            case "upcoming":
                orCondition.push({ "show.upcoming": true });
                break;
        }
        if (orCondition.length > 0) {
            filters.push({ $or: orCondition });
        }
        filters.push({
            $or: [
                { exam_type: category },
                { applicable_states: category },
                { minimum_qualification: category },
                { other_tags: category },
            ],
        });

        if (searchTerm?.trim()) {
            const term = escapeRegex(searchTerm.trim());
            filters.push({
                $or: [
                    {
                        sections: {
                            $elemMatch: {
                                elements: {
                                    $elemMatch: {
                                        name: "title",
                                        value: { $regex: `.*${term}.*`, $options: "i" },
                                    },
                                },
                            },
                        },
                    },
                    { title_slug: { $regex: `.*${term}.*`, $options: "i" } },
                ],
            });
        }

        const skip = (parseInt(index) - 1) * parseInt(items);
        const limit = parseInt(items);

        const values = {
            _id: 0,
            title: 1,
            title_slug: 1,
            description: 1,
            unique_id: 1,
            pendingForm: 1,
            category: 1,
            show: 1,
        };
        const sort = { "show.new": -1 };
        if (
            category == "latest-jobs" ||
            category == "result" ||
            category == "admission" ||
            category == "admit-cards" ||
            category == "answer-key"
        )
            sort["updated"] = -1;

        sort["inserted"] = -1;
        // Raw records query
        const rawRecords = await dbse.find({ $and: filters }, { projection: values })
            .skip(skip)
            .limit(limit)
            .sort(sort) //updated: -1, 'show.new':-1,
            .toArray();
        // return rawRecords
        const records = await Promise.all(
            rawRecords.map(async (record) => {
                const flat = {
                    title_slug: record.title_slug,
                    title: record.title,
                    description: record.description,
                    unique_id: record.unique_id,
                    pendingForm: record.pendingForm,
                    category: record.category,
                    show: Object?.entries(record?.show)?.reduce((acc, [key, value]) => {
                        if (value === true) acc[key] = true;
                        return acc;
                    }, {}),
                    updated: record.updated || null,
                    // post_date: null,
                    // name_of_organisation: null,
                    // title: null,
                    // description: null
                };

                // for (const section of record.sections || []) {
                //   for (const element of section.elements || []) {
                //     if (element.name === 'title' && !flat.title) flat.title = element.value;
                //     if (element.name === 'post_date' && !flat.post_date) flat.post_date = element.value;
                //     if (element.name === 'name_of_organisation' && !flat.name_of_organisation) flat.name_of_organisation = element.value;
                //     if (element.name === 'description' && !flat.description) flat.description = element.value;
                //   }
                // }

                return flat;
            }),
        );

        const count = await dbse.count({ $and: filters });

        return {
            stat: true,
            code: "200",
            message: `${records.length} record(s) found`,
            data: {
                list: records,
                count: count.toString(),
                index: index.toString(),
                items: items.toString(),
            },
            trxn,
            srvc: srvc || "web-client",
        };
    } catch (error) {
        return {
            stat: false,
            code: "500",
            message: error.message || "Server error",
            data: { list: [] },
            trxn,
            srvc: srvc || "web-client",
        };
    }
};

export const getLatestImportantRecords = async (body) => {
    const trxn = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const { data, srvc } = body
    try {
        const mndb = (await DatabaseFind('documents')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        const { searchTerm = "", index = 1, items = 24 } = data;
        const skip = (parseInt(index) - 1) * parseInt(items);
        const limit = parseInt(items);
        const sort = { updated: -1, inserted: -1 }
        const filters = []

        const baseFilter = { active: true, 'show.hidden': { $ne: true } };

        if (searchTerm?.trim()) {
            const term = searchTerm.trim();
            filters.push({
                $or: [
                    { title_slug: { $regex: `.*${term}.*`, $options: 'i' } },
                    {
                        sections: {
                            $elemMatch: {
                                elements: {
                                    $elemMatch: {
                                        name: "title",
                                        value: { $regex: `.*${term}.*`, $options: 'i' }
                                    }
                                }
                            }
                        }
                    }
                ]
            });
        }

        // Primary filter
        let allRecords = [];

        const values = {
            _id: 0,
            title: 1,
            title_slug: 1,
            description: 1,
            unique_id: 1,
            inserted: 1,
            pendingForm: 1,
            category: 1,
            show: 1
        };

        // 1. Try fetching important
        let primary = await dbse.find({
            $and: [
                baseFilter,
                ...filters,
                { 'show.important': true }
            ]
        }, { projection: values }).sort(sort).limit(limit).toArray();

        allRecords.push(...primary);
        let remaining = limit - primary.length;

        // 2. If not enough, fetch new
        if (remaining > 0) {
            const excludeIds = allRecords.map(r => r.unique_id);
            let secondary = await dbse.find({
                $and: [
                    baseFilter,
                    ...filters,
                    { 'show.new': true },
                    { unique_id: { $nin: excludeIds } }
                ]
            }, { projection: values }).sort(sort).limit(remaining).toArray();
            allRecords.push(...secondary);
            remaining = limit - allRecords.length;
        }

        // 3. If still not enough, fetch latest
        if (remaining > 0) {
            const excludeIds = allRecords.map(r => r.unique_id);
            let fallback = await dbse.find({
                $and: [
                    baseFilter,
                    ...filters,
                    { unique_id: { $nin: excludeIds } }
                ]
            }, { projection: values }).sort(sort).limit(remaining).toArray();
            allRecords.push(...fallback);
        }

        //Raw records query
        const rawRecords = allRecords;

        const count = await dbse.countDocuments({ $and: [baseFilter, ...filters] });

        return {
            stat: true,
            code: '200',
            message: `${rawRecords.length} record(s) found`,
            data: {
                list: rawRecords,
                count: count.toString(),
                index: index.toString(),
                items: items.toString()
            },
            trxn,
            srvc: srvc || "web-client"
        };

    } catch (error) {
        return {
            stat: false,
            code: '500',
            message: error.message || "Server error",
            data: { list: [] },
            trxn,
            srvc: srvc || "web-client"
        };
    }
}

export const getRecordDetails = async ({ data, srvc = "getRecordDetails" }) => {
    const trxn = `txn_${Date.now()}`;

    try {
        const mndb = (await DatabaseFind('documents')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        if (!data || !data.title_slug) {
            return {
                stat: false,
                code: "400",
                message: "Missing 'title_slug' in payload",
                data: null,
                trxn,
                srvc
            };
        }

        const record = await dbse.findOne(
            { $or: [{ title_slug: data.title_slug }, { unique_id: data.title_slug }] },
            { _id: 0 }
        );

        if (!record) {
            return {
                stat: true,
                code: "200",
                message: "Record not found",
                data: {},
                trxn,
                srvc
            };
        }
        const metaSection = record?.sections?.find((s) => s.title === "Meta Details");

        const title = record.title || metaSection?.elements?.find((el) => el.name === "title")?.value || "Untitled Post";

        const short_information = metaSection?.elements?.find((el) => el.name === "short_description")?.value || record.description || `Details about ${title}`;
        const image_url = metaSection?.elements?.find((el) => el.name === "image_url")?.value || null
        let rawKeywords = metaSection?.elements?.find((el) => el.name === "keywords")?.value;
        let keywords = rawKeywords ? rawKeywords.split(',').map(k => k.trim()) : [];

        keywords = [...keywords, title, "sarkari result", "government jobs"];

        return {
            stat: true,
            code: "200",
            message: "Record fetched successfully",
            data: { ...record, title, short_information, keywords, image_url },
            trxn,
            srvc
        };

    } catch (error) {
        return {
            stat: false,
            code: "500",
            message: error.message || "Internal server error",
            data: null,
            trxn,
            srvc
        };
    }
};

export const updateRecord = async ({ data, srvc }) => {
    const trxn = `txn_${Date.now()}`;
    const service = srvc || "updateRecord";

    try {
        const mndb = (await DatabaseFind('documents')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        const { unique_id, updateData } = data || {};

        if (!unique_id || !updateData || typeof updateData !== 'object') {
            return {
                stat: false,
                code: "400",
                message: "Missing or invalid 'unique_id' or 'updateData'",
                data: null,
                trxn,
                srvc: service
            };
        }

        var recordX = await dbse.findOne({ unique_id: unique_id })
        if (!recordX) {
            return {
                stat: false,
                code: "404",
                message: "record not found",
                data: null,
                trxn,
                srvc: service
            };
        }
        const metaSection = updateData?.sections?.find(s =>
            s.title?.toLowerCase().includes('meta')
        );
        const titleField = metaSection?.elements?.find(f =>
            f.name === 'title'
        );
        const descriptionField = metaSection?.elements?.find(f =>
            f.name === 'description'
        );
        const titleRaw = titleField?.value;
        const description = descriptionField?.value;
        const titleSlug = titleRaw
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');


        const show = updateData?.show

        var oldslugs = recordX.oldslugs ? recordX.oldslugs : []
        if (titleSlug != recordX.title_slug && !(titleSlug in (recordX.oldslugs || []))) {

            oldslugs.push(recordX.title_slug)
        }

        var updateDatx = { ...updateData, title: titleRaw, title_slug: titleSlug, description: description, oldslugs: oldslugs }


        if (!show.correction) {
            updateDatx['updated'] = Date.now().toString()
        }
        else {
            delete show?.correction;
        }
        const result = await dbse.updateOne(
            { unique_id: unique_id },
            { $set: { ...updateDatx } }, { upsert: true }
        );

        if (result.modifiedCount === 1) {
            return {
                stat: true,
                code: "200",
                message: "Record updated successfully",
                data: { updatedId: unique_id },
                trxn,
                srvc: service
            };
        } else if (result.matchedCount === 1) {
            return {
                stat: false,
                code: "404",
                message: "matching record found, Do changes to update",
                data: null,
                trxn,
                srvc: service
            };
        }
        else {
            return {
                stat: false,
                code: "404",
                message: "No matching record found to update",
                data: null,
                trxn,
                srvc: service
            };
        }

    } catch (error) {
        return {
            stat: false,
            code: "500",
            message: error.message || "Update failed",
            data: null,
            trxn,
            srvc: service
        };
    }
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// ---------------------- POSTER DETAILS SECTION ----------------------

export const getPosterDetails = async (body) => {
    const { data, srvc } = body || {};
    const { postId, unique_id } = data || {};
    const trxn = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (!postId && !unique_id) {
        return {
            stat: false,
            code: "400",
            memo: "Missing postId or unique_id",
            data: null,
            trxn,
            srvc
        };
    }

    try {
        const mndb = (await DatabaseFind('posters')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        // Query can match either postId or unique_id
        const query = postId
            ? { postId }
            : { unique_id };

        const record = await dbse.findOne(query);

        if (!record) {
            return {
                stat: false,
                code: "404",
                memo: "Poster not found",
                data: null,
                trxn,
                srvc
            };
        }

        return {
            stat: true,
            code: "200",
            memo: "Poster fetched successfully",
            data: record,
            trxn,
            srvc
        };
    } catch (error) {
        return {
            stat: false,
            code: "500",
            memo: error.message || "Server error",
            data: null,
            trxn,
            srvc
        };
    }
};

// ✅ Add Poster Details
export const addPosterDetails = async (body) => {
    const { data, srvc } = body;
    const trxn = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    try {
        const mndb = (await DatabaseFind('posters')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        // Validation for required fields
        const required = ["postId", "title", "organization", "position"];
        for (let field of required) {
            if (!data[field]) {
                return {
                    stat: false,
                    code: "400",
                    memo: `Missing required field: ${field}`,
                    data: null,
                    trxn,
                    srvc
                };
            }
        }

        const record = {
            postId: data.postId,
            title: data.title,
            organization: data.organization,
            description: data.description || "",
            position: data.position,
            totalPosts: data.totalPosts || 0,
            qualification: data.qualification || "",
            location: data.location || "",
            dates: {
                start: data.dates?.start || null,
                end: data.dates?.end || null,
                exam: data.dates?.exam || null
            },
            age: {
                min: data.age?.min || null,
                max: data.age?.max || null
            },
            templateId: data.templateId || null,
            addedBy: data.addedBy || "system",
            addedAt: new Date(),
            updatedAt: new Date(),
            unique_id: ItemCreate(),
            actv: true
        };

        const result = await dbse.insertOne(record);

        return {
            stat: true,
            code: "201",
            memo: "Poster details added successfully",
            data: { insertedId: result.insertedId },
            trxn,
            srvc
        };
    } catch (error) {
        return {
            stat: false,
            code: "500",
            memo: error.message || "Server error",
            data: null,
            trxn,
            srvc
        };
    }
};

// ✅ Update Poster Details
export const updatePosterDetails = async (body) => {
    const { data, srvc } = body;
    const { postId } = data;
    const trxn = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (!postId) {
        return {
            stat: false,
            code: "400",
            memo: "Missing postId",
            data: null,
            trxn,
            srvc
        };
    }

    try {
        const mndb = (await DatabaseFind('posters')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        const updateData = {
            ...data,
            updatedAt: new Date()
        };

        const result = await dbse.updateOne(
            { postId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return {
                stat: false,
                code: "404",
                memo: "Poster not found for this postId",
                data: null,
                trxn,
                srvc
            };
        }

        return {
            stat: true,
            code: "200",
            memo: "Poster details updated successfully",
            data: { postId },
            trxn,
            srvc
        };
    } catch (error) {
        return {
            stat: false,
            code: "500",
            memo: error.message || "Server error",
            data: null,
            trxn,
            srvc
        };
    }
};

// ✅ Delete Poster Details (soft delete)
export const deletePosterDetails = async (body) => {
    const { data, srvc } = body;
    const { postId } = data;
    const trxn = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (!postId) {
        return {
            stat: false,
            code: "400",
            memo: "Missing postId",
            data: null,
            trxn,
            srvc
        };
    }

    try {
        const mndb = (await DatabaseFind('posters')).data;
        var client = await getMongoClient(mndb.urim);
        const dbse = client.db(mndb.dbse).collection(mndb.dbcc);

        const result = await dbse.updateOne(
            { postId },
            { $set: { actv: false, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return {
                stat: false,
                code: "404",
                memo: "Poster not found for this postId",
                data: null,
                trxn,
                srvc
            };
        }

        return {
            stat: true,
            code: "200",
            memo: "Poster deleted (soft) successfully",
            data: { postId },
            trxn,
            srvc
        };
    } catch (error) {
        return {
            stat: false,
            code: "500",
            memo: error.message || "Server error",
            data: null,
            trxn,
            srvc
        };
    }
};
