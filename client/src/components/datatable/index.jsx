import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import ReactHTMLTableToExcel from "react-html-table-to-excel";

export default function Datatable({ data }) {
    const columns = data[0] && Object.keys(data[0]);
    return (
        <div style={{ overflow: "auto" }}>
            <table id="dataTABLE" class="table table-bordered table-striped table-dark" callPadding={0} cellSpacing={0}>
                <tbody>
                    <tr scope="row">{data[0] && columns.map((heading) => <th scope="col">{heading}</th>)}</tr>
                    {data.map(row => <tr scope="row">
                        {
                            columns.map(column => <td >  {row[column]} </td>)
                        }
                    </tr>)}
                </tbody>
            </table>
            <ReactHTMLTableToExcel
                table="dataTABLE"
                filename="Equipments File"
                sheet="Sheet"
                buttonText="Export to Excel"
                className="mt-3 mb-4 btn btn-info" />
        </div>

    );

}