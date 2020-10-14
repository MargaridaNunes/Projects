import React from 'react'

export default function CoursesDetails({ coursesDetails, onClickCourseDetail, hidden }) {

    //add the rest of the parameters e.g details
    function onClickCourseDetailCheckBox(courseDetails, cd) {
        return onClickCourseDetail(courseDetails, cd)
    }

    return hidden ? " " : (
        <table className="ui celled table" >
            <thead className="">
                <tr className="">
                    <th className="center">Detalhe UC's</th>
                </tr>
            </thead>
            <tbody className="">
                {
                    Object.keys(coursesDetails).filter(key => coursesDetails[key].visible).map(key => (
                        coursesDetails[key].courseDetails.map((cd, index) => (
                            <tr className="" key={key + "" + cd.beginDate + "" + cd.endDate + "" + cd.classroom}>
                                <td className="">
                                    <h2 className="ui aligned header">
                                        <div className="ui checkbox">
                                            <input type="checkbox" tabIndex="20" onChange={onClickCourseDetailCheckBox(coursesDetails[key], index)} />
                                            <label>
                                                {key}
                                                <p> Inicio : {cd.beginDate}  </p>
                                                <p> Fim : {cd.endDate} </p>
                                                <p> Sala : {cd.classroom} </p>
                                            </label>

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