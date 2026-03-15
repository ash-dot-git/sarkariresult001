# API & Database Restructuring — Implementation Plan

Replace MongoDB Realm App Services (EOL) with direct MongoDB driver. Restructure API into proper RESTful routes with separated business logic and query layers. Production-ready, scalable architecture.

## User Review Required

> [!IMPORTANT]
> You **must** add a `MONGODB_URI` environment variable to your `.env` file before this works. This is your MongoDB Atlas connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/newsarkariresult`).

> [!WARNING]
> The current Realm functions cannot be inspected from the frontend code — I'm reverse-engineering the exact query logic based on the function names, parameters, and return shapes. If any query doesn't behave identically, we'll debug it during verification.

> [!IMPORTANT]
> I need to know the **collection name** and **database name** in your MongoDB Atlas. I'll assume `newsarkariresult` for the database and `records` for the collection. Please confirm or correct these.

---

## Proposed Changes

### New Architecture

```
src/lib/
├── db/
│   ├── connection.js          ← MongoDB connection singleton (connection pooling)
│   └── queries/
│       └── recordQueries.js   ← Pure DB queries (repository pattern, DB-agnostic interface)
├── services/
│   └── recordService.js       ← Business logic (calls queries, formats responses)
├── api-server.js              ← [MODIFY] Updated to use services instead of Realm
├── api.js                     ← [MODIFY] Updated to use new RESTful endpoints
├── api-helpers.js             ← [KEEP] No changes
└── cors.js                    ← [KEEP] No changes

src/app/api/
├── records/
│   ├── route.js               ← [MODIFY] Proper GET (list/search) + POST (create)
│   └── [id]/
│       └── route.js           ← [MODIFY] PUT (update) + DELETE
├── records/[slug]/
│   └── route.js               ← [NEW] GET single record by slug
├── records/category/[category]/
│   └── route.js               ← [NEW] GET records by category
├── records/filter/[filterKey]/
│   └── route.js               ← [NEW] GET records by filter
├── records/slugs/
│   └── route.js               ← [NEW] GET all slugs for sitemap/SSG
├── records/important/
│   └── route.js               ← [NEW] GET latest important records
└── auth/login/
    └── route.js               ← [KEEP] No changes
```

---

### Database Layer

#### [NEW] [connection.js](file:///c:/Users/Amit%20Singh%20Patel/Desktop/MySites/NewSarkariResult/frontend/newsarkariresult.ash/src/lib/db/connection.js)

MongoDB connection singleton with:
- Connection pooling (`maxPoolSize: 10`, `minPoolSize: 2`)
- Retry on transient failures
- Cached client in `globalThis` (Next.js dev mode hot reload safe)
- `getDb()` and `getCollection(name)` exports

#### [NEW] [recordQueries.js](file:///c:/Users/Amit%20Singh%20Patel/Desktop/MySites/NewSarkariResult/frontend/newsarkariresult.ash/src/lib/db/queries/recordQueries.js)

Pure database queries, no business logic. Each function takes parameters and returns raw MongoDB results. Easy to swap out for another DB:
- `findAllRecords({ searchTerm, skip, limit, categories })`
- `findRecordBySlug(slug)`
- `findRecordsByCategory({ category, skip, limit, exclude })`
- `findRecordsByFilter({ filterKey, skip, limit })`
- `findLatestImportantRecords({ skip, limit })`
- `findAllSlugs()`
- `countRecords(filter)`
- `insertRecord(record)`
- `updateRecordById(uniqueId, updateData)`
- `deleteRecordById(uniqueId)`

---

### Business Logic Layer

#### [NEW] [recordService.js](file:///c:/Users/Amit%20Singh%20Patel/Desktop/MySites/NewSarkariResult/frontend/newsarkariresult.ash/src/lib/services/recordService.js)

Business logic that calls queries and formats responses in the **same shape** as the current Realm functions return:
- `getAllRecords(params)` → `{ stat, data: { list, count, index, items } }`
- `getRecordDetails(params)` → `{ stat, data: { data: record } }`
- `getCategoryRecords(params)` → `{ stat, data: { list, count } }`
- `getFilteredRecords(params)` → `{ stat, data: { list, count } }`
- `getLatestImportantRecords(params)` → `{ stat, data: { list } }`
- `getAllSlugs()` → `{ stat, data: { list: [slugs] } }`
- `addRecord(params)` → `{ stat, data: { insertedId } }`
- `updateRecord(params)` → `{ stat, data: { modifiedCount } }`
- `deleteRecord(params)` → `{ stat, data: { deletedCount } }`

---

### API Routes

#### [MODIFY] [route.js](file:///c:/Users/Amit%20Singh%20Patel/Desktop/MySites/NewSarkariResult/frontend/newsarkariresult.ash/src/app/api/records/route.js)

Keep existing POST handler for backward compatibility with client-side `api.js`, but route to services instead of Realm. Also add GET for listing.

#### [NEW] REST endpoints

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/records?search=&page=1&limit=25` | List/search records |
| POST | `/api/records` | Create record (admin) |
| GET | `/api/records/[slug]` | Get single record |
| PUT | `/api/records/[id]` | Update record (admin) |
| DELETE | `/api/records/[id]` | Delete record (admin) |
| GET | `/api/records/category/[category]` | Category listing |
| GET | `/api/records/filter/[filterKey]` | Filtered listing |
| GET | `/api/records/slugs` | All slugs for SSG |
| GET | `/api/records/important` | Latest important records |

---

### Files to Modify (Consumers)

#### [MODIFY] [api-server.js](file:///c:/Users/Amit%20Singh%20Patel/Desktop/MySites/NewSarkariResult/frontend/newsarkariresult.ash/src/lib/api-server.js)

Replace `callMongoFunction` import with direct `recordService` calls. Keep the same `callApi(action, payload)` function signature so all 10 consumer files continue working without changes.

#### [DELETE] [mongo-app.js](file:///c:/Users/Amit%20Singh%20Patel/Desktop/MySites/NewSarkariResult/frontend/newsarkariresult.ash/src/lib/mongo-app.js)

Remove entirely — replaced by `db/connection.js` + `db/queries/recordQueries.js`.

#### [MODIFY] [api.js](file:///c:/Users/Amit%20Singh%20Patel/Desktop/MySites/NewSarkariResult/frontend/newsarkariresult.ash/src/lib/api.js)

Update to use new REST endpoints (GET with query params for reads, POST for creates). Keep the same exported function names and return shapes.

---

### No Changes Required (These Files Stay Unchanged)

All **10 server component consumer files** continue using `callApi(action, payload)` unchanged:
- `ListingTable.jsx`, `ListingSearchTable.jsx`, `RelatedPosts.jsx`, `LatestUpdates.jsx`
- `[slug]/page.jsx`, `sarkari-result/[category]/page.jsx`, `page.jsx`, `not-found.jsx`

---

## Verification Plan

### Automated Test

Since there are no existing test files, I'll create a quick smoke test script:

```
node src/lib/db/__tests__/smoke-test.mjs
```

This script will:
1. Connect to MongoDB Atlas
2. Run each query function and verify it returns data
3. Verify response shapes match expected format

### Manual Verification (User)

**After I implement the changes, please:**

1. **Add `MONGODB_URI` to `.env`** with your Atlas connection string
2. **Run `npm install mongodb`** to install the driver
3. **Run `npm run dev`** and check:
   - Home page loads with all category listings
   - Click a post → detail page renders correctly
   - `/latest-jobs` page shows job listings
   - `/sarkari-result` page loads
   - Admin panel (`/admin/manage`) can create/edit/delete records
4. **Run `npm run build`** to verify no build errors
