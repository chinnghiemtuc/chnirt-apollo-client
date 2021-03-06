import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Form, Typography, Icon, Input, Button, Divider } from 'antd'
import './style.scss'
import { Link } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import openNotificationWithIcon from '../../components/shared/openNotificationWithIcon'

const { Title } = Typography

@inject('store')
@observer
class Login extends Component {
	state = {
		email: 'chin@gmail.com',
		password: 'd3f4ultP4ssword!',
		loading: false
	}
	handleSubmit = e => {
		e.preventDefault()
		this.setState({ loading: true, spin: true })
		this.props.form.validateFields((err, values) => {
			if (!err) {
				// console.log('Received values of form: ', values)
			}
			const { email, password } = values
			this.props.client
				.mutate({
					mutation: USER_LOGIN,
					variables: {
						userInput: {
							email,
							password
						}
					}
				})
				.then(res => {
					const { token } = res.data.login
					this.props.store.authStore.authenticate(token)
					this.setState({ loading: false, spin: false })
					this.props.history.push('/')
				})
				.catch(err => {
					// console.log(err)
					const errors = err.graphQLErrors.map(error => error.message)
					this.setState({
						loading: false,
						spin: false
					})
					openNotificationWithIcon('error', 'login', 'Login Failed.', errors[0])
				})
		})
	}
	render() {
		const { getFieldDecorator } = this.props.form
		return (
			<>
				<Row id="layout-login">
					<Col
						xs={{ span: 24, offset: 0 }}
						sm={{ span: 16, offset: 8 }}
						md={{ span: 14, offset: 10 }}
						lg={{ span: 12, offset: 12 }}
						xl={{ span: 7, offset: 17 }}
					>
						<div id="components-form-demo-normal-login">
							<Form onSubmit={this.handleSubmit} className="login-form">
								<div className="login-form-header">
									<Title level={1}>Chnirt</Title>
								</div>
								<Form.Item>
									{getFieldDecorator('email', {
										valuePropName: 'defaultValue',
										initialValue: this.state.email,
										rules: [
											{
												type: 'email',
												message: 'The input is not valid E-mail!'
											},
											{
												required: true,
												message: 'Please input your E-mail!'
											}
										]
									})(
										<Input
											prefix={
												<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
											}
											placeholder="Your@email.com"
										/>
									)}
								</Form.Item>
								<Form.Item>
									{getFieldDecorator('password', {
										valuePropName: 'defaultValue',
										initialValue: this.state.password,
										rules: [
											{
												required: true,
												message: 'Please input your Password!'
											}
										]
									})(
										<Input
											prefix={
												<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
											}
											type="password"
											placeholder="Password"
										/>
									)}
								</Form.Item>
								<Form.Item>
									<Button
										type="primary"
										htmlType="submit"
										className="login-form-button"
										loading={this.state.loading}
										disabled={this.state.loading}
									>
										{!this.state.loading ? <Icon type="login" /> : null}
										Log in
									</Button>
								</Form.Item>
								<Divider>OR</Divider>
								<br />
								<Link to="/forgot">Forgot password?</Link>
								<br />
								<span>Don't have an account?</span>
								<Link to="/register"> Register.</Link>
							</Form>
						</div>
					</Col>
				</Row>
			</>
		)
	}
}

const USER_LOGIN = gql`
	mutation($userInput: LoginUserInput!) {
		login(userInput: $userInput) {
			token
		}
	}
`

export default withApollo(Form.create({ name: 'normal_login' })(Login))
