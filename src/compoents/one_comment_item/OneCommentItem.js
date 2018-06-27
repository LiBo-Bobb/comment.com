import React, {Component} from 'react';
import {Link, hashHistory} from 'react-router'
import './OneComponentItem.css'
import comment from '../../images/comment.png';
import goodMark from '../../images/goodMark.png';
import cancelGoodMark from '../../images/cancelGoodMark.png'
import {API_deleteComment, API_zan} from "../../config";
import {Dialog} from "react-weui"
import request from "superagent";

export default class OneCommentItem extends Component {

    constructor(props) {
        super(props)
        this.handleFilterDeletedComment = props.handleFilterDeletedComment;
        let {goodCount, goodMarkedByMe} = props;
        this.state = {
            //点赞次数
            goodCount,
            goodMarkedByMe,
            //控制显示删除dialog
            isShowDeleteDialog: false,
            dialogStyle: {
                title: '你确定要删除该条评论吗？',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: this.hideDialog
                    },
                    {
                        type: 'primary',
                        label: '确认',
                        onClick: this.confirmDeleteComment
                    }
                ]
            }
        }
    }

    //隐藏
    hideDialog = () => {
        this.setState({
            isShowDeleteDialog: false,
        });
    }

    /**
     * 路由跳转到回复评论的区域
     * @param id  当前评论的id
     */
    handleToReplyComment = (id) => {
        hashHistory.push(`/two_comment/${id}`)
    }

    /**
     * 点赞评论
     * @param commentId  评论id
     */


    handleGoodMark = (commentId) => {
        let {goodCount} = this.state;
        request.post(API_zan)
            .set({'Content-Type': 'application/x-www-form-urlencoded', 'token': "zxcvoiuasdfoiuy01982734"})
            .send({
                "commentId": commentId,
                "remarkType": 1
            })
            .end(
                (err, res) => {
                    if (err === null) {
                        console.log("点赞当前评论.......")
                        console.log(res.body)
                        let {err, result: {goodMarkedByMe}} = res.body;
                        if (goodMarkedByMe) {
                            goodCount += 1;
                        } else {
                            goodCount -= 1;
                        }
                        this.setState({goodMarkedByMe, goodCount})

                    } else {

                    }
                }
            )
    }
    /**
     * 删除评论
     * @param commentId   评论id
     */
    handleDeleteComment = (commentId) => {
        request.post(API_deleteComment)
            .set({'Content-Type': 'application/x-www-form-urlencoded', 'token': "zxcvoiuasdfoiuy01982734"})
            .send({
                "commentId": commentId,
            })
            .end(
                (err, res) => {
                    if (err === null) {
                        console.log("删除指定评论列表请求结果.......")
                        console.log(res.body)
                        let {err, result: {success}} = res.body;
                        if (err === null && success) {
                            this.handleFilterDeletedComment(commentId)
                        }

                    } else {

                    }
                }
            )
    }
    //控制实付删除该条评论
    confirmDeleteComment = () => {
        let {oen_comment_id} = this.props;
        this.hideDialog()
        this.handleDeleteComment(oen_comment_id)
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log("nextProps...", nextProps)
    // }
    render() {
        let {goodCount, goodMarkedByMe} = this.state;
        // let {content, created_at_display, oen_comment_id, headimgurl, username, goodCount, currentCommentReplyCounts, goodMarkedByMe} = this.state;
        let {content, created_at_display, oen_comment_id, headimgurl, username, currentCommentReplyCounts} = this.props;
        return (<div className="OneComponentBox">
            {/*删除确认框是start*/}
            <Dialog type="ios"
                    title={this.state.dialogStyle.title}
                    buttons={this.state.dialogStyle.buttons}
                    show={this.state.isShowDeleteDialog}>
            </Dialog>
            {/*删除确认框是end*/}
            <div className="leftHeadImg">
                <img style={{width: "100%"}} src={headimgurl} alt="用户图像"/>
            </div>
            <div className="rightContentArea">
                <div className="firstLineContent">
                    <div className="userName">
                        {username}
                    </div>
                    <div className="goodMark">
                        <div className="clickCommentBox">
                            <div className="commentCounts"
                                 onClick={e => this.setState({isShowDeleteDialog: true})}
                                 style={{color: "#15B8FF", fontSize: "12px"}}>
                                删除
                            </div>
                        </div>
                        <div className="clickCommentBox" onClick={() => {
                            this.handleToReplyComment(oen_comment_id)
                        }}>
                            <div className="commentIcon">
                                <img style={{width: "100%"}} src={comment} alt=""/>
                            </div>
                            <div className="commentCounts">
                                {currentCommentReplyCounts}
                            </div>
                        </div>
                        <div className="clickGoodMarkBox" onClick={() => {
                            this.handleGoodMark(oen_comment_id)
                        }}>
                            <div className="goodMarkIcon">
                                <img style={{width: "100%"}} src={goodMarkedByMe ? goodMark : cancelGoodMark} alt=""/>
                            </div>
                            <div className="goodMarkCounts">
                                {goodCount}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="secondLineContent">
                    <div className="showTime">
                        {created_at_display}
                    </div>
                    <div className="replyBtn">
                    </div>
                </div>
                <div className="commentContentBox">
                    <div className="content">
                        {content}
                    </div>
                    {/*<div className="deleteBtn" onClick={e => this.setState({isShowDeleteDialog: true})}>*/}
                    {/*删除*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>)
    }

}