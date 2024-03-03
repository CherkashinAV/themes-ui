import React from 'react'
import {useParams} from 'react-router-dom'

const Theme = () => {
	const {themeId} = useParams();
	return (
		<div>Theme {themeId}</div>
	)
}

export default Theme