import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import SourcePreview from '../../../component/SourcePreview/index';

import { Layout, Menu, Icon, Input, Radio } from 'antd';
import AudioRecordLayer from "./AudioRecordLayer";
const { SubMenu } = Menu;
const { Content, Sider } = Layout;
const { TextArea }  = Input;
const RadioGroup = Radio.Group;

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
            // {type: 'text', value: '今天是星期几'}, {type: 'img', value: 'http:\\img\logo.img'} ...
            question: [],
            // answerType: textChoice, imgChoice, voiceChoice, fillBlanks, drawCanvas, voiceInput
            // {type: textChoice, options: ['...', '...', ...]}
            // {type: imgChoice, options: ['url', 'url', ...]}
            // {type: voiceChoice, options: ['url', 'url', ...]}
            // {type: fillBlanks}
            // {type: drawCanvas}
            // {type: voiceInput}
            answer: {},
            showAudioRecordLayer: false,
        }
    }

    /**
     * 渲染题干
     * */
    _renderQuestion(){
        let questionsRender = [];
        this.state.question.map((item, index) => {
            if (item) {
                let renderRow = null;
                switch (item.type){
                    case 'text':
                        renderRow =
                            <RenderRow index={index} key={index} delete={this.deleteQuestion}>
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

    /**
     * 渲染问题
     * */
    _renderAnswer(){
        const answer = this.state.answer;
        if (!answer){
            return;
        }
        switch (answer.type){
            case 'textChoice':
                const textOptions = answer.options;
                return (
                    <RadioGroup style={styles.radioGroupStyle} onChange={() => {}}>
                        {textOptions.map((option, index) => {
                            return (
                                <RenderRow key={index} index={index} delete={this.deleteTextChoice}>
                                    <Radio style={styles.radioStyle} value={index}>
                                        <Input
                                            placeholder="请填写选项内容"
                                            value={option}
                                            onChange={(e) => {
                                                let state = this.state;
                                                state.answer.options[index] = e.nativeEvent.target.value;
                                                this.setState(state);
                                            }}
                                        />
                                    </Radio>
                                </RenderRow>
                            );
                        })}
                    </RadioGroup>
                );
            case 'imgChoice':
                const imgOptions = answer.options;
                return (
                    <RadioGroup style={styles.radioGroupStyle} onChange={() => {}}>
                        {imgOptions.map((option, index) => {
                            return (
                                <RenderRow index={index} key={index} delete={this.deleteImgChoice} type={'img'}>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Radio style={styles.radioStyle} value={index}/>
                                        <img key={index} src={option} alt={'error'}/>
                                    </div>
                                </RenderRow>
                            );
                        })}
                    </RadioGroup>
                );
        }
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
                            <Menu.Item key="textChoice">文字选择题</Menu.Item>
                            <Menu.Item key="imgChoice">
                                <SourcePreview id={'answerImgPreview'} onImgReady={this._onAnswerImgReady} type={'img'}/>
                                <label htmlFor={'answerImgPreview'}>图片选择题</label>
                            </Menu.Item>
                            <Menu.Item key="voiceChoice">语音选择题</Menu.Item>
                            <Menu.Item key="fillBlanks">填空题</Menu.Item>
                            <Menu.Item key="drawCanvas">画图题</Menu.Item>
                            <Menu.Item key="voiceInput">语音作答题</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Content ref={c => this._content = c} style={{ padding: '0 24px', minHeight: 280, position: 'relative' }}>
                    {this._renderQuestion()}
                    {this._renderAnswer()}
                    {this.state.showAudioRecordLayer ? <AudioRecordLayer saveAudioRecord={this.saveAudioRecord} onClose={this.onAudioRecordLayerClose}/> : null}
                </Content>
            </Layout>
        );
    }

    componentDidMount(){
        /**
         * 设置编辑面板的宽高与 window 等比例
         * */
        setTimeout(() => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const content = this._content;
            const contentNode = ReactDOM.findDOMNode(content);
            const contentWidth = parseInt(window.getComputedStyle(contentNode).width, 10);
            const contentHeight = windowHeight * contentWidth / windowWidth;
            contentNode.style.height = `${contentHeight}px`;
        }, 0);
    }

    /**
     * 添加内容
     * */
    _addContent = ({ item, key, keyPath }) => {
        if (key === 'addText'){
            let state = this.state;
            state.question.push({type: 'text', value: ''});
            this.setState(state);
        } else if (key === 'addAudioRecord'){
            this.setState({showAudioRecordLayer: true});
        } else if (key === 'textChoice') {
            const state = this.state;
            const answer = state.answer;
            if (!answer.type){
                answer.type = 'textChoice';
                answer.options = [''];
                this.setState(state);
                return;
            }
            if (answer.type === 'textChoice') {
                answer.options.push('');
                this.setState(state);
            }
        }
    };

    /**
     * 删除题干
     * */
    deleteQuestion = (index) => {
        let state = this.state;
        state.question.splice(index, 1);
        this.setState(state);
    };

    /**
     * 删除文字选择题答案
     * */
    deleteTextChoice = (index) => {
        const state = this.state;
        state.answer.options.splice(index, 1);
        if (state.answer.options.length === 0) {
            state.answer.type = undefined;
        }
        this.setState(state);
    };

    /**
     * 删除图片选择题答案
     * */
    deleteImgChoice = (index) => {
        const state = this.state;
        state.answer.options.splice(index, 1);
        if (state.answer.options.length === 0) {
            state.answer.type = undefined;
        }
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

    /**
     * 添加题干中图片(图片准备好后的回调函数)
     * */
    _onImgReady = (srcArr) => {
        this.addQuestionElement('img', srcArr);
    };

    /**
     * 添加题干中音频(音频准备好后的回调函数)
     * */
    _onAudioReady = (srcArr) => {
        this.addQuestionElement('audio', srcArr);
    };

    /**
     * 关闭录音蒙层
     * */
    closeAudioRecordLayer = () => {
        this.setState({showAudioRecordLayer: false});
    };

    /**
     * 录音蒙层中保存录音按钮方法
     * */
    saveAudioRecord = (audioSource) => {
        this.addQuestionElement('audio', [audioSource]);
        this.closeAudioRecordLayer();
    };

    /**
     * 录音蒙层中点击 X 按钮方法
     * */
    onAudioRecordLayerClose = () => {
        this.closeAudioRecordLayer();
    };

    /**
     * 图片选择题中添加图片选项(图片准备好后的回调函数)
     * state.answer 格式: {type: imgChoice, options: ['url', 'url', ...]}
     * */
    _onAnswerImgReady = (srcArr) => {
        const state = this.state;
        const answer = state.answer;
        if (!answer.type){
            answer.type = 'imgChoice';
            answer.options = srcArr;
            this.setState(state);
            return;
        }
        if (answer.type === 'imgChoice') {
            const newAnswerOptions = answer.options.concat(srcArr);
            const state = this.state;
            state.answer.options = newAnswerOptions;
            this.setState(state);
        }
    }
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
    },
    radioGroupStyle: {
        width: '100%',
    },
    radioStyle: {
        display: 'block',
        height: '32px',
        lineHeight: '32px',
        paddingRight: 20
    },
};

export default ContentBody;