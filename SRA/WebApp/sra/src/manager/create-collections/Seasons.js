import React from 'react'


export default function Seasons({ seasons, onClickSeason }) {


    return (
        <table className="ui celled table" >
            <thead className="">
                <tr className="">
                    <th className="">Épocas</th>
                </tr>
            </thead>
            <tbody className="">
                {seasons.map(s => (
                    <tr className="" key={s.seasonNumber}>
                        <td className="">
                            <h2 className="ui aligned header">
                                <div className="ui checkbox">
                                    <input type="checkbox" tabIndex="20" onChange={onClickSeason(s)} />
                                    <label>{s.semesterRepresent}</label>
                                </div>
                            </h2>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}