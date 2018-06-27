import React, {Component} from 'react';
import './App.css';
import request from 'superagent';
import {API_loadSubject, API_publishApi} from './config';
//以及评论得到单个评论组件
import OneCommentItem from './compoents/one_comment_item/OneCommentItem';
//发表评论的输入框组件
import CommentTextArea from './compoents/comment_textarea/CommentTextArea'
import {LoadMore} from 'react-weui';
import {Helmet} from 'react-helmet';
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //1级评论列表数据
            OneComments: [],
            //翻页使用
            nextPageFromTime: "",
            //控制是否显示评论内容输入框
            isShowCommentTextArea: false,
            //主题Id
            subjectId: 0,
            //回复总数
            replyCount: 0,
        }
    }
    /**
     * 加载主题评论列表
     *
     */
    loadSubjectCommentList = () => {
        let {nextPageFromTime, OneComments} = this.state;
        this.setState({isLoadingSub: false})
        request.post(API_loadSubject)
            .set({'Content-Type': 'application/x-www-form-urlencoded', 'token': "zxcvoiuasdfoiuy01982734"})
            .send({
                "subjectKey": "course-41940",
                "nextPageFromTime": nextPageFromTime,
            })
            .end(
                (err, res) => {
                    if (err === null) {
                        console.log("评论列表请求结果.......")
                        console.log(res.body)
                        let {err, result: {subject: {subComment, id, replyCount}, nextPageFromTime}} = res.body;
                        this.setState({
                            OneComments: OneComments.concat(subComment),
                            nextPageFromTime,
                            subjectId: id,
                            isLoadingSub: true,
                            replyCount,
                        })
                    } else {


                    }
                }
            )
    }


    //主题评论发表成功以后刷新列表
    loadSubjectCommentList2 = () => {
        let {OneComments} = this.state;
        request.post(API_loadSubject)
            .set({'Content-Type': 'application/x-www-form-urlencoded', 'token': "zxcvoiuasdfoiuy01982734"})
            .send({
                "subjectKey": "course-41940",
                "nextPageFromTime": "",
            })
            .end(
                (err, res) => {
                    if (err === null) {
                        console.log("主题评论发表成功以后刷新列表.......")
                        console.log(res.body)
                        let {err, result: {subject: {subComment, id}}} = res.body;
                        this.setState({OneComments: subComment, CopyOneComments: subComment, subjectId: id})
                    } else {

                    }
                }
            )
    }

    /**
     * 删除当前的评论成功以后，利用评论id在总评论中过滤掉本条评论，减少服务器请求
     * @param commentId   评论id
     */
    handleFilterDeletedComment = (commentId) => {
        let {OneComments} = this.state;
        let arr_filtered = OneComments.filter(i => i.id !== commentId)
        this.setState({OneComments: arr_filtered})

    }


    /**
     * 发表评论
     */
    pubComment = (commentContent) => {
        let {subjectId} = this.state;
        // if (this.props.children) {
        //     subjectId = this.props.params.commentId;
        // }
        request.post(API_publishApi)
            .set({'Content-Type': 'application/x-www-form-urlencoded', 'token': "zxcvoiuasdfoiuy01982734"})
            .send({
                "commentId": subjectId,
                "message": commentContent,
            })
            .end(
                (err, res) => {
                    if (err === null) {
                        console.log("发表评论列表请求结果.......")
                        console.log(res.body)
                        let {err, result: {comment}} = res.body
                        //隐藏输入框以
                        console.log("comment....", comment)
                        this.hideCommentTextArea()
                        this.loadSubjectCommentList2()
                    } else {

                    }
                }
            )

    }

    //点击底部评论按钮，显示评论内容输入的textArea
    showCommentTextArea = () => {
        this.setState({isShowCommentTextArea: true})
    }

    //隐藏
    hideCommentTextArea = () => {
        this.setState({isShowCommentTextArea: false})
    }


    componentDidMount() {
        /**
         * 加载当前评论列表
         */
        this.loadSubjectCommentList()
    }


    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)
        // console.log("nextProps.....", nextProps.params.commentId)
        if (typeof nextProps.params.commentId === "undefined") {
            this.loadSubjectCommentList2()
        }
    }

    //隐藏删除dialog
    hideDeleteDialog = () => {
        this.setState({isShowDeleteDialog: false})
    }

    render() {
        let {OneComments, nextPageFromTime, isShowCommentTextArea, isLoadingSub, replyCount} = this.state;
        let subjectList = OneComments.map((item, index) => {
            return <OneCommentItem
                key={`OneCommentItem${index}`}
                //主题评论内容
                content={item.content}
                //主题评论id
                oen_comment_id={item.id}
                // 创建时间
                created_at_display={item.created_at_display}
                //评论者的用户图像
                headimgurl={item.headimgurl}
                //用户名
                username={item.username}
                //点赞数
                goodCount={item.goodCount}
                //当前评论的回复数
                currentCommentReplyCounts={item.subComment.length}
                //是否被点赞
                goodMarkedByMe={item.goodMarkedByMe}
                //删除当前的评论成功以后，利用评论id在总评论中过滤掉本条评论，减少服务器请求
                handleFilterDeletedComment={this.handleFilterDeletedComment}
            />
        })
        let htmlDiv;
        if (isLoadingSub && OneComments.length > 0) {
            htmlDiv = subjectList;
        } else {
            if (isLoadingSub && OneComments.length === 0) {
                htmlDiv = <LoadMore showLine>暂无评论，赶紧抢沙发吧</LoadMore>
            } else {
                htmlDiv = <LoadMore loading>Loading</LoadMore>
            }
        }
        return (
            <div>
                {this.props.children && this.props.children}
                {!this.props.children && <div className="App">
                    <Helmet>
                        <title>{`评论详情`}</title>
                    </Helmet>
                    {subjectList}
                    {/*翻页功能start*/}
                    {
                        (nextPageFromTime)
                            ? <div
                                onClick={this.loadSubjectCommentList}
                                style={{textAlign: "center", fontSize: "12px", color: "#969696"}}>
                                加载更多
                            </div>
                            : <div style={{textAlign: "center", fontSize: "12px", color: "#969696"}}>
                                <LoadMore showLine>已经到最底了</LoadMore>
                            </div>
                    }
                    {/*翻页功能end*/}
                </div>}
                {(isShowCommentTextArea && !this.props.children) &&
                <CommentTextArea
                    pubComment={this.pubComment}
                    hideCommentTextArea={this.hideCommentTextArea}
                />}
                {/*底部评论按钮start*/}
                {!this.props.children &&
                <div className="bottom_comment_btn" onClick={this.showCommentTextArea}>
                    <div className="leftInput">
                        写评论
                    </div>
                    <div className="commentBtn">
                        评论
                    </div>
                </div>
                }
                {/*底部评论按钮end*/}
            </div>
        );
    }
}

export default App;
