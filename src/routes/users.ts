import { and, desc, getTableColumns, ilike, or, sql } from "drizzle-orm"
import express from "express"
import { user } from "../db/schema/index.js"
import { db } from "../db/index.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query

        const currentPage = Math.max(1, parseInt(String(page), 10) || 1)
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100)

        const offset = (currentPage - 1) * limitPerPage

        const filterConditions = []

        if (search) {
            filterConditions.push(
                or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))
            )
        }

        if (role) {
            filterConditions.push(ilike(user.role, `${role}`))
        }


        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined

        const countResult = await db.select({ count: sql<number>`count(*)` })
            .from(user)
            .where(whereClause)

        const totalCount = Number(countResult[0]?.count) ?? 0

        const userList = await db.select({ ...getTableColumns(user) })
            .from(user)
            .where(whereClause)
            .limit(limitPerPage)
            .orderBy(desc(user.createdAt))
            .offset(offset)

        res.status(200).json({
            data: userList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage)
            }
        })

    } catch (e) {
        console.log(`GET /users Error: ${e}`)
        res.status(500).json({ error: 'Failer to get Users' })
    }
})

export default router