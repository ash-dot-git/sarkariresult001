// service
const mndb = [
    //services
    {
        form: 'documents',
        dbse: 'datavault', dbcc: 'jobsorvacancies',
        urim: process.env.MONGODB_DATA_URI
    },
    {
        form: 'posters',
        dbse: 'datavault', dbcc: 'posterdetails',
        urim: process.env.MONGODB_DATA_URI
    },
]

export default async function DatabaseFind(item) {

    const data = item

    const result = mndb.find(item => item.form === data)
    return { data: { dbse: result?.dbse || "", dbcc: result?.dbcc || "", urim: result?.urim || "" } }

}