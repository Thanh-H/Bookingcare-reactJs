
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import { getProfileDoctorById } from '../../../services/userService'
import NumberFormat from 'react-number-format';
import { LANGUAGES } from '../../../utils';
import './ProfileDoctor.scss'
class ProfileDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataProfile: ''
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })
    }

    getInforDoctor = async (id) => {
        let result = {}
        if (id) {
            let res = await getProfileDoctorById(id)
            if (res && res.errCode === 0) {
                result = res.data
            }
        }
        return result
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
    }
    render() {
        let { dataProfile } = this.state;
        let { language } = this.props
        let name = ''
        console.log(dataProfile)
        if (dataProfile && dataProfile.positionData) {
            name = language === LANGUAGES.VI ?
                `${dataProfile.positionData.valueVi + ' ' + dataProfile.lastName + ' ' + dataProfile.firstName}`
                :
                `${dataProfile.positionData.valueEn + ' ' + dataProfile.firstName + ' ' + dataProfile.lastName}`

        }
        return (
            <div className='profile-doctor-container'>
                <div className="intro-doctor">
                    <div className="content-left"
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                    >
                    </div>
                    <div className="content-right">
                        <div className="up">
                            {name}
                        </div>
                        <div className="down">
                            {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description &&
                                <span>{dataProfile.Markdown.description}</span>}
                        </div>
                    </div>
                </div>
                <div className="price">
                    Giá Khám:
                    {dataProfile && dataProfile.Doctor_infor && language === LANGUAGES.VI &&
                        <NumberFormat
                            className='currency'
                            value={dataProfile.Doctor_infor.priceData.valueVi}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'VND'}
                        />}
                    {dataProfile && dataProfile.Doctor_infor && language === LANGUAGES.EN &&
                        <NumberFormat
                            className='currency'
                            value={dataProfile.Doctor_infor.priceData.valueEn}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'$'}
                        />}
                </div>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
