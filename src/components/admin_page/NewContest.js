import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Spinner } from 'react-bootstrap';

import ErrorHandler from '../error_handler/ErrorHandler';
import Card from './QuestionCard';

class Contest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: null,
			loading: true,
			questions: [],
			cName: "",
			error: null,
			linking: false
		};
		this.handling = this.handling.bind(this);
	}

	handling(event) {
		const target = event.target ;
		const value = target.value ;
		const name = target.name ;
		this.setState ({
			[name] : value
		});
	}

	catchError = error => {
		this.setState({ error: error })
	}

	errorHandler = () => {
		this.setState({ error: null });
	};

	componentDidMount() {
		setTimeout(() => {
			fetch('http://localhost:8000/feed/newcontest', {
				headers: {
					Authorization: 'Bearer ' + this.props.token,
					'Content-Type': 'application/json'
				}
			})
			.then(res => {
				this.setState({ status : res.status });
				return res.json();
			})
			.then(resData => {
				if(this.state.status !== 200) {
					throw new Error(resData.message);
				}
				this.setState({
					loading: false,
					questions: resData.questions
				});
			})
			.catch(this.catchError)
		}, 1000);
	};

	catchError = (error) => {
		this.setState({ error: error })
	}

	handle = (e) => {
		fetch('http://localhost:8000/feed/newcontest-delete-question', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + this.props.token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				questionId: e.target.value
			})
		})
		.then(res => {
			this.setState({ status : res.status });
			return res.json();
		})
		.then(resData => {
			if(this.state.status !== 200) {
				throw new Error(resData.message);
			}
			return resData;
		})
		.catch(this.catchError);
	}

	linkingHandle = (e) => {

	}

	handler = (e) => {
		console.log(this.state.linking);
		this.state.linking = false;
		console.log(this.state.linking);
		fetch('http://localhost:8000/feed/finalcontest', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + this.props.token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				cName: this.state.cName
			})
		})
		.then(res => {
			console.log(res);
			this.state.status = res.status;
			console.log(res);
			return res.json();
		})
		.then(resData => {
			console.log(resData);
			if(this.state.status !== 200) {
				throw new Error(resData.message);
			}
			console.log(this.state.linking);
			this.state.linking = true;
			console.log(this.state.linking);
			return resData;
		})
		.catch(this.catchError);
	}

	render() {
		return (
			<Container style={{ padding: '10px 50px' }}>
				{this.state.loading && (
					<div style={{ textAlign: 'center', marginTop: '2rem' }}>
						<Spinner
							size='lg'
							variant="primary"
							animation="border"
							role="status"
						/>
					</div>
				)}
				<ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
				<Form>
					<Form.Group controlId="exampleForm.ControlTextarea1">
						<Form.Label>Contest Name</Form.Label>
						<Form.Control 
							placeholder="Contest Name"
							name="cName"
							as="textarea" 
							rows="1" 
							value={this.state.cName}
							onChange={this.handling}
						/>
					</Form.Group>
				</Form>
				{
					this.state.questions.map(q => (
						<Card
							value="Remove"
							sign={'-'}
							handle={this.handle}
							key={q.questionId._id}
							id={q.questionId._id}
							title={q.questionId.title}
						/>
					))
				}
				<Form>
					<Form.Group style={{ textAlign: 'center', marginTop: '10px' }}>
						<Button style={{ marginBottom: '10px' }} onClick={this.handler}>Host</Button>
						{console.log(this.state.linking)}
					</Form.Group>
				</Form>
			</Container>
		)
	}
}

export default Contest;
