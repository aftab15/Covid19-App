import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core'


const InfoBox = ({title, cases,active,isRed, isBlack,  total, ...props}) => {
    return (
            <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'} ${isBlack && 'infoBox--black'}`}>
                <CardContent>
                    <Typography  className='infoBox__title' color='textSecondary'> 
                        {title}
                    </Typography>
                    <Typography   className={`infoBox__cases ${!isRed && 'infoBox__cases--green'} ${isBlack && 'infoBox__cases--black'}`}>
                        {cases} Today
                    </Typography>
                    <Typography   className='infoBox__total' color='textSecondary'>
                        {total} Total
                    </Typography>
                </CardContent>
            </Card>
    )
}

export default InfoBox
