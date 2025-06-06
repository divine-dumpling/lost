import { faDotCircle } from '@fortawesome/free-regular-svg-icons'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Form, FormGroup, FormText, Input, Label } from 'reactstrap'
import { useOwnUser, useUpdateOwnUser } from '../../actions/user/user_api'
import BaseContainer from '../../components/BaseContainer'
import { CenteredSpinner } from '../../components/CenteredSpinner'
import IconButton from '../../components/IconButton'
import * as Notification from '../../components/Notification'

const Profile = () => {
    const { t } = useTranslation()

    const { data: user, isLoading } = useOwnUser()
    const { mutate: updateOwnUser } = useUpdateOwnUser()

    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const submit = (e) => {
        e.preventDefault()
        if (confirmPassword !== password) {
            Notification.showError('Passwords are not equal')
            return
        }
        if (password && password.length < 5) {
            Notification.showError('Minimum 5 characters')
            return
        }
        updateOwnUser({
            email,
            first_name: firstName,
            last_name: lastName,
            password,
        })
    }

    useEffect(() => {
        if (user) {
            setEmail(user.email)
            setFirstName(user.first_name)
            setLastName(user.last_name)
        }
    }, [user])

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value)
    }

    const handleLastNameChange = (e) => {
        setLastName(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
    }

    if (isLoading) {
        return <CenteredSpinner />
    }

    return (
        user && (
            <BaseContainer>
                <Col xs="12" md="12" lg="12">
                    <Form onSubmit={submit}>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="myprofile-userName">
                                    {t('myProfile.user')}
                                </Label>
                            </Col>
                            <Col xs="12" md="5">
                                <Input
                                    disabled
                                    defaultValue={user.user_name}
                                    type="text"
                                    name="myprofile-userName"
                                    placeholder=""
                                />
                                <FormText className="help-block">
                                    {t('myProfile.usernameIsNotEditable')}
                                </FormText>
                            </Col>
                            <Col xs="12" md="4">
                                <Input
                                    disabled
                                    defaultValue={user.idx}
                                    type="text"
                                    name="myprofile-idx"
                                    placeholder=""
                                />
                                <FormText className="help-block">
                                    {t('myProfile.userIdIsNotEditable')}
                                </FormText>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="myprofile-email">Email</Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input
                                    disabled={user.is_external}
                                    defaultValue={email}
                                    onChange={handleEmailChange}
                                    type="email"
                                    id="myprofile-email"
                                    name="myprofile-email"
                                    placeholder="Enter email..."
                                    autoComplete="email"
                                />
                                <FormText className="help-block">
                                    {t('myProfile.pleaseEnterYourEmail')}
                                </FormText>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="myprofile-name">Name</Label>
                            </Col>
                            <Col xs="12" md="5">
                                <Input
                                    disabled={user.is_external}
                                    defaultValue={firstName}
                                    onChange={handleFirstNameChange}
                                    type="text"
                                    id="myprofile-firstName"
                                    name="myprofile-firstName"
                                    placeholder={t('myProfile.firstName')}
                                    autoComplete="firstName"
                                />
                                <FormText className="help-block">
                                    {t('myProfile.pleaseEnterYourFirstName')}
                                </FormText>
                            </Col>
                            <Col xs="12" md="4">
                                <Input
                                    disabled={user.is_external}
                                    defaultValue={lastName}
                                    onChange={handleLastNameChange}
                                    type="text"
                                    id="myprofile-lastName"
                                    name="myprofile-lastName"
                                    placeholder={t('myProfile.lastName')}
                                    autoComplete="lastName"
                                />
                                <FormText className="help-block">
                                    {t('myProfile.pleaseEnterYourLastName')}
                                </FormText>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="myprofile-password">
                                    {t('myProfile.password')}
                                </Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input
                                    disabled={user.is_external}
                                    defaultValue={password}
                                    onChange={handlePasswordChange}
                                    type="password"
                                    id="myprofile-password"
                                    name="myprofile-password"
                                    placeholder={t('myProfile.password')}
                                    autoComplete="current-password"
                                />
                                <FormText className="help-block">
                                    {t('myProfile.pleaseEnterNewPassword')}
                                </FormText>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col md="3">
                                <Label htmlFor="myprofile-confirm-password">
                                    {t('myProfile.confirmPassword')}
                                </Label>
                            </Col>
                            <Col xs="12" md="9">
                                <Input
                                    defaultValue={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    type="password"
                                    id="myprofile-confirm-password"
                                    name="myprofile-confirm-password"
                                    placeholder={t('myProfile.password')}
                                    autoComplete="current-password"
                                />
                                <FormText className="help-block">
                                    {t('myProfile.pleaseConfirmNewPassword')}
                                </FormText>
                            </Col>
                        </FormGroup>
                        <IconButton
                            type="submit"
                            color="primary"
                            icon={faDotCircle}
                            text={t('myProfile.submit')}
                        />
                    </Form>
                </Col>
            </BaseContainer>
        )
    )
}
export default Profile
