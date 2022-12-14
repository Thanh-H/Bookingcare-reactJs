
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import * as actions from '../../../store/actions'
import { LANGUAGES } from '../../../utils';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailSpecialty.scss'
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialById, getAllCodeService } from '../../../services/userService'
import _ from 'lodash';
import HomeFooter from '../../HomePage/HomeFooter'
import { withRouter } from 'react-router';


class DetailSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    async componentDidMount() {

        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            let res = await getDetailSpecialById(id, 'ALL')
            let resProvince = await getAllCodeService('PROVINCE');
            if (resProvince && resProvince.errCode === 0) {
                let listProvince = resProvince.data
                let objectAllProvince = {
                    keyMap: 'ALL',
                    type: 'PROVINCE',
                    valueVi: 'Tất cả Tỉnh thành',
                    valueEn: 'All Provinces'
                }
                listProvince = [objectAllProvince, ...listProvince]
                this.setState({
                    listProvince: listProvince
                })
            }
            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = []
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => { arrDoctorId.push(item.doctorId) })
                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }

    }

    handleOnchangeSelect = async (e) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            let location = e.target.value
            let res = await getDetailSpecialById(id, location)
            // let resProvince = await getAllCodeService('PROVINCE');
            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = []
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => { arrDoctorId.push(item.doctorId) }) // tạo 1 mảng mới chỉ có doctor id
                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    // listProvince: resProvince.data
                })
            }
        }

    }


    handleViewDetailDoctor = (doctorId) => {
        this.props.history.push(`/detail-doctor/${doctorId}`)
    }

    render() {
        console.log('check list province', this.state.listProvince)
        let { arrDoctorId, listProvince, dataDetailSpecialty } = this.state
        let { language } = this.props
        return (
            <>
                <div className='detail-specialty-container'>
                    <HomeHeader />
                    <div className='detail-special-body'>
                        <div className='description-specialty'>
                            {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) &&
                                <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }}></div>}
                        </div>
                        <div className='search-sp-doctor'>
                            <select onChange={(e) => this.handleOnchangeSelect(e)}>
                                {listProvince && listProvince.length > 0 &&
                                    listProvince.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}> {language === LANGUAGES.VI ? item.valueVi : item.valueEn} </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        {arrDoctorId && arrDoctorId.length > 0 &&
                            arrDoctorId.map((item, index) => {
                                return (
                                    <div className='each-doctor' key={index}>
                                        <div className='dt-content-left'>
                                            <div className='profile-doctor'>
                                                <ProfileDoctor
                                                    isShowprice={false}
                                                    doctorId={item}
                                                    isShowDescription={true}
                                                />
                                            </div>
                                            <div onClick={() => this.handleViewDetailDoctor(item)} className='more-doctor-infor'>
                                                <FormattedMessage id='homepage.more-infor'
                                                /> </div>
                                        </div>

                                        <div className='dt-content-right'>
                                            <div className='doctor-schedule'>
                                                <DoctorSchedule
                                                    idFromParent={item}
                                                />
                                            </div>
                                            <div className='doctor-extra-infor'>
                                                <DoctorExtraInfor
                                                    idFromParent={item}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                    <HomeFooter />
                </div>


            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty));
