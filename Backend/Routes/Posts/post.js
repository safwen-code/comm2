const express = require('express')
const router = express.Router()
const auth = require('../../middelware/auth')
const User = require('../../Model/User')
const Post = require('../../Model/Post')

//add post
router.post('/addPost', auth, async (req, res) => {
  try {
    const { text } = req.body
    //find user
    let user = await User.findById(req.user.id).select('-password')
    const newPost = new Post({
      text,
      name: user.name,
      user: user.id,
    })
    const post = await newPost.save()
    res.status(201).json(post)
    //add post
  } catch (error) {
    console.error(error.message)
    res.status(500).json('server error')
  }
})

//get allpost
router.get('/allPost', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (error) {
    console.error(error.message)
    res.status(500).json('server Error')
  }
})

//get post by id
router.get('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    const post = await Post.findById(id)
    if (!post) {
      res.status(404).json({ msg: 'no post ' })
    }
    res.json(post)
  } catch (error) {
    console.error(error.message)
    res.status(500).json('Server Error')
  }
})

//delete post by id
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: 'post not found' })
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: 'stop your are not the owner' })
    }

    await post.remove()
    res.json('post is deleted')
  } catch (error) {
    console.error(error.message)
    res.status(500).json('Server Error')
  }
})

//likePost
//put post/like/:idpost
router.put('/like/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id)
    //check if the post has all ready liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(404).json({ msg: 'user all ready like' })
    }

    post.likes.unshift({ user: req.user.id })
    await post.save()
    res.json(post)
  } catch (error) {
    console.error(error.message)
    res.status(500).json('Server error')
  }
})

//unlike post
//unlike/:idpost

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id)
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(404).json({ msg: 'post is has been unliked' })
    }
    //get the romve index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)
    console.log(removeIndex)
    post.likes.splice(removeIndex, 1)
    await post.save()
    res.json(post)
  } catch (error) {
    console.error(err.message)
    res.status(500).json({ msg: 'server error' })
  }
})

//add comment
//comment/idpost
router.put('/comment/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id)
    let user = await User.findById(req.user.id)
    const { text } = req.body
    const newcomment = {
      text,
      user: user.id,
      name: user.name,
    }
    post.comments.unshift(newcomment)
    await post.save()
    res.status(201).json(post)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ msg: 'server error' })
  }
})

//delete comment
//comment/idpost/idcomment
router.put('/comment/:idpost/:comm', auth, async (req, res) => {
  try {
    const idpost = req.params.idpost
    const comm = req.params.comm
    let post = await Post.findById(idpost)
    //get the comment
    const comment = post.comments.find((comment) => comment.id === comm)
    //make sure comment exist
    if (!comment) {
      res.status(404).json({ msg: "comment doesn't not found" })
    }
    //check user is exist
    if (comment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'user is not authorised' })
    }
    //get the remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id)
    console.log(comment)
    console.log(removeIndex)
    post.comments.splice(removeIndex, 1)
    await post.save()
    res.status(201).json(post)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ msg: 'server Error' })
  }
})

module.exports = router
