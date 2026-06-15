import express from "express"
import { db } from "../db/index.js"
import { classes, subjects, user } from "../db/schema/index.js"
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const { search, department, page = 1, limit = 10 } = req.query

        const currentPage = Math.max(1, parseInt(String(page), 10) || 1)
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100)

        const offset = (currentPage - 1) * limitPerPage

        const filterConditions = []

        if (search) {
            filterConditions.push(
                or(ilike(classes.name, `%${search}%`), ilike(classes.description, `%${search}%`))
            )
        }

        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined

        const countResult = await db.select({ count: sql<number>`count(*)` })
            .from(classes)
            .leftJoin(subjects, eq(subjects.id, classes.subjectId))
            .leftJoin(user, eq(user.id, classes.teacherId))
            .where(whereClause)

        const totalCount = Number(countResult[0]?.count) ?? 0


        const classesList = await db.select({ ...getTableColumns(classes), subject: subjects.name, teacher: user.name })
            .from(classes)
            .leftJoin(subjects, eq(subjects.id, classes.subjectId))
            .leftJoin(user, eq(user.id, classes.teacherId))
            .where(whereClause)
            .orderBy(desc(classes.createdAt))
            .limit(limitPerPage)
            .offset(offset)

        res.status(200).json({
            data: classesList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage)
            }
        })


    } catch (e) {
        console.error(`GET /classes error:${e}`)
        res.status(500).json({ error: 'Failed to get classes' })
    }
})

router.post("/", async (req, res) => {
    try {

        const [createdClass] = await db.insert(classes).values({
            ...req.body,
            inviteCode: Math.random().toString(36).substring(2, 9),
            schedules: []
        }).returning({ id: classes.id })

        if (!createdClass) throw Error

        res.status(201).json({ data: createdClass })
    } catch (e) {
        console.log(`POST /classes error ${e}`)
        res.status(500).json({ error: e })
    }
})

export default router