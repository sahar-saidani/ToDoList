import BlogModel from "../models/BlogModel.js";

// ==========================
// GET ALL BLOGS
// ==========================
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.findAll()
        return res.status(200).json(blogs.map(blog => blog.toJSON()))
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// ==========================
// GET ONE BLOG
// ==========================
export const getBlog = async (req, res) => {
    try {
        const blog = await BlogModel.findByPk(req.params.id)

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" })
        }

        return res.status(200).json(blog)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// ==========================
// CREATE BLOG
// ==========================
export const createBlog = async (req, res) => {
    try {
        await BlogModel.create(req.body)

        return res.status(201).json({
            message: "Creation avec un succès!"
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// ==========================
// UPDATE BLOG
// ==========================
export const updateBlog = async (req, res) => {
    try {
        const updated = await BlogModel.update(req.body, {
            where: { id: req.params.id }
        })

        return res.status(200).json({
            message: "Registro actualizado correctamente!",
            updated
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// ==========================
// DELETE BLOG
// ==========================
export const deleteBlog = async (req, res) => {
    try {
        const deleted = await BlogModel.destroy({
            where: { id: req.params.id }
        })

        return res.status(200).json({
            message: "Registro eliminado correctamente!",
            deleted
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}