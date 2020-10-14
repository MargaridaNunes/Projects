import React from 'react'


export default function Programmes({ programmes, onClickProgramme, hidden }) {

    function onClickProgrammeCheckBox({ seasonNumber, semesterRepresent }, programme) {
        return onClickProgramme({ seasonNumber, semesterRepresent }, programme)
    }


    return hidden ? " " : (
        <table className="ui celled table" >
            <thead className="">
                <tr className="">
                    <th className="">Cursos</th>
                </tr>
            </thead>
            <tbody className="">
                {
                    Object.keys(programmes).filter(key => programmes[key].visible).map(key => (
                        programmes[key].programmes.map(p => (<tr className="" key={key + "" + p.id}>
                            <td className="">
                                <h2 className="ui aligned header">
                                    <div className="ui checkbox">
                                        <input type="checkbox" tabIndex="20" onChange={onClickProgrammeCheckBox(programmes[key], p)} />
                                        <label> {key} <p> {p.acronym} </p>  </label>
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