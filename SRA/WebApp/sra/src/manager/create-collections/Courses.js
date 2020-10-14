import React from 'react'

export default function Courses({ courses, onClickCourse, hidden }) {

    function onClickCourseCheckBox({ seasonNumber, semesterRepresent, programmeAcronym, programmeId, classAcronym }, courseAcronym) {
        return onClickCourse({ seasonNumber, semesterRepresent }, { programmeAcronym, programmeId }, classAcronym, courseAcronym)
    }


    return hidden ? " " : (
        <table className="ui celled table" >
            <thead className="">
                <tr className="">
                    <th className="">Unidades Curriculares</th>
                </tr>
            </thead>
            <tbody className="">
                {
                    Object.keys(courses).filter(key => courses[key].visible).map(key => (
                        courses[key].courses.map(c => (
                            <tr className="" key={key + "" + c.acronym}>
                                <td className="">
                                    <h2 className="ui aligned header">
                                        <div className="ui checkbox">
                                            <input type="checkbox" tabIndex="20" onChange={onClickCourseCheckBox(courses[key], c.acronym)} />
                                            <label> {key} <p> {c.acronym}  </p></label>
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