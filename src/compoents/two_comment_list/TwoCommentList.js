import React, {Component} from 'react';
import {API_loadComent, API_publishApi} from '../../config'
import request from "superagent";
import './TwpCommentList.css';
//二级评论的主评论(Top)
import SingleComment from '../single_comment/SingleComment'
//回复内容的列表组件
import ReplyContentList from '../reply_content/list/ReplyContentList';
//二级评论内容输入框
import CommentTextArea from '../comment_textarea/CommentTextArea';
import {Helmet} from 'react-helmet';

export default class TwoCommentList extends Component {
    constructor(props) {
        super(props)
        let {commentId} = props.params;
        this.state = {
            //评论Id
            commentId,
            //评论内容
            content: "",
            //回复内容[]
            replyContent: [],
            //当前要回复的评论id
            replyCommentId: 0,
            //控制显示输入框
            isShowTextArea: false,
            replyCount: 0,
        }
    }

    /**
     * 加载子评论列表
     * @param commentId  评论id
     */

    loadTwoCommentList = (commentId) => {
        request.post(API_loadComent)
            .set({'Content-Type': 'application/x-www-form-urlencoded', 'token': "zxcvoiuasdfoiuy01982734"})
            .send({
                "commentId": commentId,
            })
            .end(
                (err, res) => {
                    if (err === null) {
                        console.log("加载指定子评论列表请求结果.......")
                        console.log(res.body)
                        let {err, result: {comment}} = res.body;
                        let {subComment, content, headimgurl, replyCount, created_at_display, username, goodCount, id, goodMarkedByMe} = comment;
                        console.log("subComment......", subComment)
                        this.setState({
                            content,
                            replyContent: subComment,
                            headimgurl,
                            replyCount,
                            created_at_display,
                            username,
                            goodCount,
                            replyCommentId: id,
                            goodMarkedByMe

                        })
                    } else {

                    }
                }
            )
    }

    /**
     * 发表回复内容
     * @param commentContent  评论的内容
     */
    pubReplyComment = (commentContent) => {
        let {commentId} = this.props.params;

        request.post(API_publishApi)
            .set({'Content-Type': 'application/x-www-form-urlencoded', 'token': "zxcvoiuasdfoiuy01982734"})
            .send({
                "commentId": commentId,
                "message": commentContent,
            })
            .end(
                (err, res) => {
                    if (err === null) {
                        console.log("发表回复评论.......")
                        console.log(res.body)
                        // let {err, result: {comment}} = res.body
                        // //隐藏输入框以
                        // console.log("comment....", comment)
                        // this.setState({OneComments: OneComments.concat(comment)})
                        this.hideCommentTextArea()
                        this.loadTwoCommentList(commentId)
                    } else {

                    }
                }
            )
    }

    //弹出输入框
    showCommentTextArea = () => {
        this.setState({isShowTextArea: true})
    }

    //隐藏输入框
    hideCommentTextArea = () => {
        this.setState({isShowTextArea: false})
    }

    componentDidMount() {
        //TODO :把输入框和按钮在这个组件再放一个
        let {commentId} = this.state;
        this.loadTwoCommentList(commentId)
    }

    //删除评论以后，对自评论列表进行静态刷新
    deletedChildComment = (id) => {
        // console.log("刷新子评论需要的id.....", id)
        let {replyContent} = this.state;
        let arrFiltered = replyContent.filter(item => item.id !== id)
        this.setState({replyContent: arrFiltered})
    }

    render() {
        let {content, replyContent, headimgurl, username, created_at_display, goodCount, replyCommentId, goodMarkedByMe, isShowTextArea, replyCount} = this.state;
        return (<div className="two_comment_box">
            <Helmet>
                <title>
                    {`回复评论`}
                </title>
            </Helmet>
            {/*当前需要回复的评论start*/}
            <SingleComment
                content={content}
                headimgurl={headimgurl}
                username={username}
                created_at_display={created_at_display}
                goodCount={goodCount}
                replyCommentId={replyCommentId}
                goodMarkedByMe={goodMarkedByMe}
                loadTwoCommentList={this.loadTwoCommentList}
                commentId={this.props.params.commentId}
            />
            {/*当前需要回复的评论end*/}
            {/*回复评论区域start*/}
            <ReplyContentList
                //子评论数据
                replyContent={replyContent}
                //删除评论以后
                deletedChildComment={this.deletedChildComment}
            />
            {/*回复评论区域end*/}


            {isShowTextArea &&
            <CommentTextArea
                pubComment={this.pubReplyComment}
                hideCommentTextArea={this.hideCommentTextArea}
            />
            }

            <div className="bottom_comment_btn" onClick={this.showCommentTextArea}>
                <div className="leftInput">
                    回复评论
                </div>
                <div className="commentBtn">
                    评论
                </div>
            </div>

        </div>)
    }

}