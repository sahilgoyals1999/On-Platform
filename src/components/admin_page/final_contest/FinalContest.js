import React, { Component, Fragment } from 'react'
import { Spinner } from 'react-bootstrap'
import FinalContestCard from './FinalContestCard'
import ErrorHandler from '../../error_handler/ErrorHandler'

class FinalContest extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		loading: true,
			finalcontest: [],
			error: null
		}
	};

	componentDidMount() {
		let status;
		fetch('http://localhost:8000/feed/finalcontest', {
			headers: {
        Authorization: 'Bearer ' + this.props.token,
				'Content-Type': 'application/json'
      }
    })
			.then(res => {
				status = res.status;
        return res.json();
      })
			.then(resData=> {
				this.setState({ loading: false });
				if(status === 200) {
				  this.setState({ finalcontest: resData.finalcontest });
				}
				else {
					throw new Error(resData.message);
				}
			})
			.catch(this.catchError);
	};

	handler = (e) => {
		let status;
		fetch('http://localhost:8000/feed/allcontests', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contestId: e.target.value
      })
    })
    .then(res => {
    	  console.log(res.status)
    	  status = res.status;
    	  return res.json();
     })
     .then(resData => {
     	 if(status === 500) {
     	 	  throw new Error(resData.message);
        }
        else {
        	this.props.history.push('/admin/allcontests');
        }
     })
    .catch(this.catchError);
	}

  catchError = error => {
    this.setState({ error: error })
  }

   errorHandler = () => {
    this.setState({ error: null });
  }

	render() {
		return (
			<Fragment>
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
				{
					this.state.finalcontest.map(contest => (
					<FinalContestCard
						sign={'End'}
						handle={this.handler}
						key={contest._id}
						title={contest.contestName}
						id={contest._id}
						questions={contest.questions}
						admin={contest.admin.name}
					/>
				  ))
				}
			</Fragment>
		)
	}
}

export default FinalContest;
