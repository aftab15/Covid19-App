import numeral from 'numeral';
import React from 'react';
import './Table.css'



const Table = ({countries}) => {
    return (
        <div className="table">
            <table>
            {
            countries.map(({country, cases})=>{
                return(
                <tr key={country}>
                    <td>{country}</td>
                    <td><strong>{numeral(cases).format("0,0")}</strong></td>
                </tr>
                )
            })
            }
                            
            </table>
        </div>
    )
}

export default Table
