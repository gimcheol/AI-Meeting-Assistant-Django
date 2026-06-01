// join_modal.jsx

import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    FormGroup,
    Label,
    Input,
} from "reactstrap";

const TermsModal = ({ isOpen, toggleModal, onConfirm }) => {
    const [allAgreed, setAllAgreed] = useState(false);
    const [agreements, setAgreements] = useState({
        termsAgreed: false,
        personalInfoAgreed: false,
        provisionAgreed: false,
        voiceInfoAgreed: false,
        serviceAgreed: false,
    });

    useEffect(() => {
        const agreementsWithoutService = { ...agreements, serviceAgreed: true };
        const allChecked = Object.values(agreementsWithoutService).every((value) => value);
        setAllAgreed(allChecked);
    }, [agreements]);

    const handleAgreementChange = (event) => {
        const { name, checked } = event.target;
    
        setAgreements((prevAgreements) => ({ ...prevAgreements, [name]: checked }));
    
        const agreementsWithoutService = { ...agreements, serviceAgreed: true };
        const allChecked = Object.values(agreementsWithoutService).every((value) => value);
        setAllAgreed(allChecked);
    };  

    const handleAllAgreementChange = (event) => {
        const { checked } = event.target;
        setAgreements((prevAgreements) => 
            Object.keys(prevAgreements).reduce(
                (newAgreements, agreementKey) => ({
                    ...newAgreements,
                    [agreementKey]: checked,
                }), 
                {}
            )
        );
        setAllAgreed(checked);
    };

    const handleConfirm = () => {
        onConfirm();
        toggleModal();
    };

    return (
        <Modal isOpen={isOpen} toggle={toggleModal} style={{ color:"black" }}>
            <ModalHeader toggle={toggleModal}>약관 및 조건</ModalHeader>
            <ModalBody>
                <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            id="agree_check_all"
                            name="agree_check_all"
                            checked={allAgreed}
                            onChange={handleAllAgreementChange}
                        />
                        New KT 서비스 약관에 모두 동의합니다.
                    </Label>
                </FormGroup>
                <p>
                    전체 동의 시 필수사항 및 선택사항에 대해 일괄 동의하게 되며,
                    개별적으로도 동의를 선택하실 수 있습니다.
                </p>
                <p>
                    필수 항목은 서비스 제공을 위해 필요한 항목이므로, 동의를
                    거부하시는 경우 서비스 이용에 제한이 있을 수 있습니다.
                </p>

                {/* Additional checkboxes */}
                <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            id="agree_check_used"
                            name="termsAgreed"
                            checked={agreements.termsAgreed}
                            onChange={handleAgreementChange}
                        />
                        [필수] 이용약관 동의
                    </Label>
                </FormGroup>

                <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            id="agree_check_info"
                            name="personalInfoAgreed"
                            checked={agreements.personalInfoAgreed}
                            onChange={handleAgreementChange}
                        />
                        [필수] 개인정보 이용 수집 방침
                    </Label>
                </FormGroup>

                <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            id="agree_check_info_other"
                            name="provisionAgreed"
                            checked={agreements.provisionAgreed}
                            onChange={handleAgreementChange}
                        />
                        [필수] 개인정보 제 3자 제공 동의
                    </Label>
                </FormGroup>

                <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            id="agree_check_voice"
                            name="voiceInfoAgreed"
                            checked={agreements.voiceInfoAgreed}
                            onChange={handleAgreementChange}
                        />
                        [필수] 음성 정보 수집 및 이용 동의
                    </Label>
                </FormGroup>

                <FormGroup check>
                    <Label check>
                        <Input
                            type="checkbox"
                            id="agree_check_push"
                            name="serviceAgreed"
                            checked={agreements.serviceAgreed}
                            onChange={handleAgreementChange}
                        />
                        [선택] 이벤트, 뉴스 정보 수신 동의
                    </Label>
                </FormGroup>
                {/* Add more checkboxes as needed */}
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    onClick={handleConfirm}
                    disabled={!allAgreed}
                >
                    확인
                </Button>
                <Button color="secondary" onClick={toggleModal}>
                    닫기
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default TermsModal;
