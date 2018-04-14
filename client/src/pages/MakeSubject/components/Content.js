import React, { Component } from 'react';

import SourcePreview from '../../../component/SourcePreview/index';

import { Layout, Menu, Icon, Input, Button } from 'antd';
import AudioRecordLayer from "./AudioRecordLayer";
const { SubMenu } = Menu;
const { Content, Sider } = Layout;
const { TextArea }  = Input;

const RenderRow = props => {
    const containerStyle = {
        padding: 20,
        backgroundColor: 'whitesmoke',
        marginBottom: 20,
        borderRadius: 4,
        position: 'relative',   // 父元素设置 relative，子元素的 absolute 就相对于父元素
        width: props.type === 'img' ? 'fit-content' : 'auto'
    };
    return (
        <div style={containerStyle}>
            <div style={styles.closeIcon} onClick={() => {props.delete(props.index);}}>
                <Icon type="close"/>
            </div>
            {props.children}
        </div>
    )
};

/**
 * Demo
 * 题干：字、图、音
 * 问题：文字选择题、键盘输入、画图输入选其一
 * type: text/img/audio/video
 * */
class ContentBody extends Component {
    constructor(props){
        super(props);
        this.state = {
            question: [], // {type: 'text', value: '今天是星期几'}, {type: 'img', value: 'http:\\img\logo.img'} ...
            answer: {
                options: [],
                blankLength: false,
                draw: false
            },
            showAudioRecordLayer: false,
        }
    }

    _renderQuestion(){
        let questionsRender = [];
        this.state.question.map((item, index) => {
            if (item) {
                let renderRow = null;
                switch (item.type){
                    case 'text':
                        renderRow =
                            <RenderRow index={index} key={index} delete={this.delete}>
                                <TextArea value={item.value} onChange={e => {
                                    let state = this.state;
                                    state.question[index].value = e.nativeEvent.target.value;
                                    this.setState(state);
                                }}/>
                            </RenderRow>;
                        questionsRender.push(renderRow);
                        break;
                    case 'img':
                        renderRow =
                            <RenderRow index={index} key={index} delete={this.delete} type={'img'}>
                                <img key={index} src={item.value} alt={'error'}/>
                            </RenderRow>;
                        questionsRender.push(renderRow);
                        break;
                    case 'audio':
                        renderRow =
                            <RenderRow index={index} key={index} delete={this.delete}>
                                <audio style={{width: '100%'}} key={index} src={item.value} controls={'controls'}/>
                            </RenderRow>;
                        questionsRender.push(renderRow);
                        break;
                    default:
                        break;
                }
            }
        });
        return questionsRender;
    }

    render() {
        return (
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1', 'sub2']}
                        style={{ height: '100%' }}
                        onClick={this._addContent}
                    >
                        <SubMenu key="sub1" title={<span><Icon type="question-circle-o"/>创建题干</span>}>
                            <Menu.Item key="addText">
                                添加文字
                            </Menu.Item>
                            <Menu.Item key="addImg">
                                <SourcePreview id={'imgPreview'} onImgReady={this._onImgReady} type={'img'}/>
                                <label htmlFor={'imgPreview'}>添加图片</label>
                            </Menu.Item>
                            <Menu.Item key="addAudio">
                                <SourcePreview id={'audioPreview'} onImgReady={this._onAudioReady} type={'audio'}/>
                                <label htmlFor={'audioPreview'}>添加音频</label>
                            </Menu.Item>
                            <Menu.Item key="addAudioRecord">添加录音</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="plus-circle-o" />创建问题</span>}>
                            <Menu.Item key="5">选择题</Menu.Item>
                            <Menu.Item key="6">填空题</Menu.Item>
                            <Menu.Item key="7">画图题</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Content style={{ padding: '0 24px', minHeight: 280, position: 'relative' }}>
                    {this._renderQuestion()}
                    {this.state.showAudioRecordLayer ? <AudioRecordLayer saveAudioRecord={this.saveAudioRecord} onClose={this.onAudioRecordLayerClose}/> : null}
                </Content>
            </Layout>
        );
    }

    /**
     * 添加内容
     * */
    _addContent = ({ item, key, keyPath }) => {
        switch (key){
            case 'addText':
                let state = this.state;
                state.question.push({type: 'text', value: ''});
                this.setState(state);
                break;
            case 'addAudioRecord':
                this.setState({showAudioRecordLayer: true});
                break;
            default:
                break;
        }
    };

    /**
     * 删除内容
     * */
    delete = (index) => {
        let state = this.state;
        state.question.splice(index, 1);
        this.setState(state);
    };

    /**
     * 添加 state.question 元素
     * */
    addQuestionElement(type, srcArr){
        let state = this.state;
        srcArr.forEach( src => {
            state.question.push({type: type, value: src});
        } );
        this.setState(state);
    }

    _onImgReady = (srcArr) => {
        this.addQuestionElement('img', srcArr);
    };

    _onAudioReady = (srcArr) => {
        this.addQuestionElement('audio', srcArr);
    };

    /**
     * 关闭录音蒙层
     * */
    closeAudioRecordLayer = () => {
        this.setState({showAudioRecordLayer: false});
    };

    saveAudioRecord = (audioSource) => {
        this.addQuestionElement('audio', [audioSource]);
        this.closeAudioRecordLayer();
    };

    onAudioRecordLayerClose = () => {
        this.closeAudioRecordLayer();
    };
}

const styles = {
    renderRowContainer: {
        padding: 20,
        backgroundColor: 'whitesmoke',
        marginBottom: 20,
        borderRadius: 4,
        position: 'relative',   // 父元素设置 relative，子元素的 absolute 就相对于父元素
    },
    closeIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
    }
};

export default ContentBody;