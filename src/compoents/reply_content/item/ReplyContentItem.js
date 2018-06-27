import React, {Component} from 'react';
import './ReplyContentItem.css'
import goodMark from '../../../images/goodMark.png'
import cancelGoodMark from '../../../images/cancelGoodMark.png'
import {API_deleteComment, API_zan} from '../../../config'
import request from "superagent";
import {Dialog} from 'react-weui';

export default class ReplyContentItem extends Component {
    constructor(props) {
        super(props)
        let {goodMarkedByMe, goodCount} = props;
        this.state = {
            goodMarkedByMe,
            goodCount,
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

    confirmDeleteComment = () => {
        let {commentId} = this.props;
        this.hideDialog();
        this.handleDeleteComment(commentId)

    }


    /**
     * 删除回复的评论
     * @param commentId   评论id
     */
    handleDeleteComment = (commentId) => {
        let {deletedChildComment} = this.props;
        request.post(API_deleteComment)
            .set({'Content-Type': 'application/x-www-form-urlencoded', 'token': "zxcvoiuasdfoiuy01982734"})
            .send({
                "commentId": commentId,
            })
            .end(
                (err, res) => {
                    if (err === null) {
                        console.log("删除回复内容.......")
                        console.log(res.body)
                        let {err, result: {success}} = res.body;
                        if (err === null && success) {
                            // this.handleFilterDeletedComment(commentId)
                            deletedChildComment(commentId)

                        }

                    } else {
                    }
                }
            )
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
                        console.log("点赞子评论.......")
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


    render() {
        let {goodCount,goodMarkedByMe} = this.state;
        let {content, headimgurl, created_at_display, username, commentId,} = this.props;
        return (<div className="singleCommentBoxs">
            <Dialog type="ios"
                    title={this.state.dialogStyle.title}
                    buttons={this.state.dialogStyle.buttons}
                    show={this.state.isShowDeleteDialog}>
            </Dialog>
            <div className="leftHeadImgs">
                <img style={{width: "100%"}} src={headimgurl} alt="用户图像"/>
            </div>
            <div className="rightContentAreas">
                <div className="firstLineContents">
                    <div className="userNames">
                        {username}
                    </div>
                    <div className="goodMarks" onClick={() => {
                        this.handleGoodMark(commentId)
                    }}>
                        <div className="replyCommentGoodMarkIcon">
                            <img style={{width: "100%"}} src={goodMarkedByMe ? goodMark : cancelGoodMark} alt=""/>
                        </div>
                        <div className="replyGoodMarkCounts">
                            {goodCount}
                        </div>
                    </div>
                </div>
                <div className="secondLineContents">
                    <div className="showTimes">
                        {created_at_display}
                    </div>
                    <div className="replyBtns"
                         onClick={e => {
                             console.log("22222")
                             this.setState({isShowDeleteDialog: true})
                         }}>
                        删除
                    </div>
                </div>
                <div className="commentContents">
                    {content}
                </div>
            </div>
        </div>)
    }

}