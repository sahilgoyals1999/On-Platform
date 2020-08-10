import React from 'react'
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'

import './Navbar.css'
import logo from '../../images/logo1.jpg'
import Contest from '../Contest'
import PreviousContest from '../PreviousContest'
import AddQuestion from '../AddQuestion'
import AllQuestions from '../AllQuestions'
import Question from '../../single_question/Question'

export default class Navbar extends React.Component {
	render() {
		return (
			<Router>
				<div className='na'>
			    <ul className='one'>
				    <Link to='/admin/questions'>
					    <li value='ques'>Questions</li>
			  	    </Link>
			    	<Link to='/admin/addquestion'>
						<li value='Addques'>Add Question</li>
					</Link>
					<Link to='/admin/contest'>
				    	<li value='contest'>Contest</li>
				    </Link>
					<Link to='/admin/previouscontest'>
				    	<li value='PCON'>Previous Contests</li>
				    </Link>
					<Link to='/admin/about'>
						<li value='about'><img className = 'log' alt='logo' src= {logo}></img></li>
				    </Link>
				    <Link to='/'>
    	            <button className='but' type="submit" value='Signout'>Sign Out</button>
    	            </Link>
		    	</ul>
			    <div className='coc'>
			    	<Switch>
			    	    <Route path="/admin/contest"
			    	    	exact
			    	    	render = {props => (
			    	    		<Contest
			    	    			token = {this.props.token}
			    	    		/>
			    	    	)}
			    	    />
					    <Route
					    	path="/admin/questions"
					    	exact
					    	render = {props => (
					    		<AllQuestions
										token = {this.props.token}
					    		/>
					    	)}
					    />
					    <Route
					    	path="/admin/previouscontest"
					    	exact
					    	render = {props => (
					    		<PreviousContest
										token = {this.props.token}
					    		/>
					    	)}
					    />
					    <Route
					    	path="/admin/addquestion"
					    	exact
					    	render = {props => (
					    		<AddQuestion
					    			token = {this.props.token}
					    		/>
					    	)}
					    />
					    <Route
					    	path="/question/:id"
					    	render = {props => (
					    		<Question
					    			token = {this.props.token}
					    		/>
					    	)}
					    />
				    </Switch>
		    	</div>
				</div>
			</Router>
		)
	}
}