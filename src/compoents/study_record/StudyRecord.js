import React, {Component} from 'react';
import {LoadMore} from 'react-weui';
import request from 'superagent';
//学习记录接口地址
const GET_RECORDS_API = "https://www.gankao.com/apiv4/user/studyRecord";
export default class StudyRecord extends Component {
    constructor(props) {
        super(props)
        //用户id通过组件属性传递
        this.user_id = props.user_id || 917492;
        this.state = {
            studyRecords: [],
            //学习总时长
            studyDuration: 0,
            //当前页码
            current_page: 1,
            //最后一页
            last_page: 0,
            //控制是否显示loading
            isShowLoading: false,

        }
    }

    componentDidMount() {
        this.getStudyRecords(1)
    }

    getStudyRecords = (currentPage) => {
        let {studyRecords} = this.state;
        let param = {user_id: this.user_id, page: currentPage}
        this.setState({isShowLoading: true})
        request.get(GET_RECORDS_API).query(param).then((res) => {
            // console.log("请求成功.......", res)
            let {data, current_page, studyDuration, last_page} = res.body;
            console.log("studyDuration.....", data)
            this.setState({
                studyRecords: studyRecords.concat(data),
                studyDuration,
                current_page,
                last_page,
                isShowLoading: false
            })
        }).catch((err) => {
            console.log("错误。。。。", err)
        })
    }

    turnPage = () => {
        let {current_page} = this.state;
        let now_page = current_page + 1;
        this.getStudyRecords(now_page)


    }

    render() {
        let {studyRecords, studyDuration, current_page, last_page, isShowLoading} = this.state;
        let study_records = studyRecords.map((item, index) => {
            return <div className="page__bd" key={`outArr${index}`}>
                <div className="weui-panel weui-panel_access">
                    <div className="weui-panel__hd" style={{color: "#188eee"}}>{item.title}</div>
                    {item.records.map((item1, index1) => {
                        //学习进度百分比
                        let progress = `${item1.progress}%`
                        return <a className="weui-media-box weui-media-box_appmsg"
                                  key={`childRecord${index1}`}>
                            <div className="weui-media-box__hd"
                                 style={{height: "81px", width: "125px"}}>
                                < img className="weui-media-box__thumb"
                                      src={item1.title_pic}
                                      alt=""/>
                            </div>
                            <div className="weui-media-box__bd">
                                <h4 className="weui-media-box__title">{item1.course_name}</h4>
                                <p className="weui-media-box__desc">
                                </p>
                                <div className="weui-progress__bar" style={{margin: "5px 0"}}>
                                    <div className="weui-progress__inner-bar js_progress"
                                         style={{width: progress}}>
                                    </div>
                                </div>
                                <div style={{color: "#969696", fontSize: "12px"}}>
                                    已完成{`${item1.progress}%`}
                                </div>
                            </div>
                        </a>
                    })}

                </div>
            </div>
        })

        let contentDiv;
        if (!isShowLoading && study_records.length > 0) {
            contentDiv = study_records;
        } else {
            if (!isShowLoading && study_records.length === 0) {
                contentDiv = <LoadMore showLine>暂无学习记录</LoadMore>
            } else {
                contentDiv = <LoadMore loading>加载中...</LoadMore>
            }
        }

        return (
            <div style={{maxWidth: "768px", margin: "0 auto"}}>
                <div className="page panel js_show">
                    <div style={{display: "flex", margin: "10px 15px", justifyContent: "space-between"}}>
                        <div className="leftTextGk" style={{fontSize: "14px"}}>
                            累计学习时长
                        </div>
                        <div className="studyTimeCounts" style={{fontSize: "14px", color: "#188eee"}}>
                            {studyDuration}分钟
                        </div>
                    </div>

                    {studyRecords.length > 0 ? study_records : <LoadMore showLine>暂无学习记录</LoadMore>}
                    {(studyRecords.length > 0 && current_page < last_page)
                        ? <div
                            onClick={this.turnPage}
                            style={{textAlign: "center", fontSize: "14px", margin: "20px 0"}}>
                            加载更多
                        </div>
                        : <LoadMore showLine>已经到最底了</LoadMore>
                    }


                </div>
            </div>

        )
    }
}
