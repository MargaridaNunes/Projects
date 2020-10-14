import React from 'react'

export default function Classes({ classes, onClickClass, hidden }) {

    function onClickClassCheckBox({ seasonNumber, semesterRepresent, programmeAcronym, programmeId }, classAcronym) {
        return onClickClass({ seasonNumber, semesterRepresent }, { programmeAcronym, programmeId }, classAcronym)
    }

    return hidden ? " " : (
        <table className="ui celled table" >
            <thead className="">
                <tr className="">
                    <th className="">Turmas</th>
                </tr>
            </thead>
            <tbody className="">
                {
                    Object.keys(classes).filter(key => classes[key].visible).map(key => (
                        classes[key].classes.map(c => (
                            <tr className="" key={key + "" + c.acronym}>
                                <td className="">
                                    <h2 className="ui aligned header">
                                        <div className="ui checkbox">
                                            <input type="checkbox" tabIndex="20" onChange={onClickClassCheckBox(classes[key], c.acronym)} />
                                            <label> {key} <p> {c.acronym} </p>  </label>
                                        </div>
                                    </h2>
                                </td>
                            </tr>
                        )
                        )
                    )
                    )
                }

            </tbody>
        </table>
    )
}