import AbstractBox from "../components/AbstractBox.vue"
import AuthorBox from "../components/AuthorBox.vue"
import CiteLink from "../components/CiteLink.vue"
import CodeBox from "../components/CodeBox.vue"
import ContentTable from "../components/ContentTable.vue"
import DocumentBegin from "../components/DocumentBegin.vue"
import DocumentEnd from "../components/DocumentEnd.vue"
import EquBlock from "../components/EquBlock.vue"
import EquInline from "../components/EquInline.vue"
import EquationBox from "../components/EquationBox.vue"
import FigureBox from "../components/FigureBox.vue"
import HoverTip from "../components/HoverTip.vue"
import ReferenceList from "../components/ReferenceList.vue"
import RemarkBox from "../components/RemarkBox.vue"
import SmartLink from "../components/SmartLink.vue"
import TableBox from "../components/TableBox.vue"
export function load_modules(app){
app.component("AbstractBox",AbstractBox)
app.component("AuthorBox",AuthorBox)
app.component("CiteLink",CiteLink)
app.component("CodeBox",CodeBox)
app.component("ContentTable",ContentTable)
app.component("DocumentBegin",DocumentBegin)
app.component("DocumentEnd",DocumentEnd)
app.component("EquBlock",EquBlock)
app.component("EquInline",EquInline)
app.component("EquationBox",EquationBox)
app.component("FigureBox",FigureBox)
app.component("HoverTip",HoverTip)
app.component("ReferenceList",ReferenceList)
app.component("RemarkBox",RemarkBox)
app.component("SmartLink",SmartLink)
app.component("TableBox",TableBox)
}