import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSections } from "../../redux/sections"

export default function ProductScreen() {
    const dispatch = useDispatch()
    const [tabMode, setTabMode] = useState("newline")
    const [specTextLeft, setSpecTextLeft] = useState("")
    const [specTextRight, setSpecTextRight] = useState("")

    const { specifications } = useSelector(state => state).sections
    const handleTabChange = ({ target }) => {
        setTabMode(target.value)
    }
    const handleChange = ({ target }) => {
        if (target.name === "specs-left") {
            const formattedValue = target.value.replaceAll("\t", "\n")
            setSpecTextLeft(formattedValue)
            const result = []
            const cells = formattedValue.split("\n")
            for (let i = 0; i < cells.length - 1; i += 2) {
                const cell1 = cells[i].replaceAll("\t", " ").trim()
                const cell2 = cells[i + 1].replaceAll("\t", " ").trim()
                const currentRow = [cell1, cell2].filter(c => c.length)
                result.push(currentRow.join(":"))
            }
            dispatch(setSections({specifications: {...specifications, left: result}}))
        } else {
            const formattedValue = target.value.replaceAll("\t", "\n")
            setSpecTextRight(formattedValue)
            const result = []
            const cells = formattedValue.split("\n")
            for (let i = 0; i < cells.length - 1; i += 2) {
                const cell1 = cells[i].replaceAll("\t", " ").trim()
                const cell2 = cells[i + 1].replaceAll("\t", " ").trim()
                const currentRow = [cell1, cell2].filter(c => c.length)
                result.push(currentRow.join(":"))
            }
            dispatch(setSections({specifications: {...specifications, right: result}}))
        }
    }
    useEffect(() => {
        if (specifications) {
            setSpecTextLeft(specifications.left.map(spec => {
                const cells = spec.split(":")
                if (cells.length == 1) {
                    return cells[0] + "\n"
                }
                return cells.join("\n")
            }).join("\n"))
            setSpecTextRight(specifications.right.map(spec => {
                const cells = spec.split(":")
                if (cells.length == 1) {
                    return cells[0] + "\n"
                }
                return cells.join("\n")
            }).join("\n"))
        }
    }, [])
    return (
        <>
            <p style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>Each cell in the specifications table must be separated by a newline (enter key).<br/>To make a green cell heading, add an additional newline under the heading.<br/>Please only add package contents in the Package Contents section.</p>
            <div class="specsRow">
                <div class="spec">
                    <h2>Left</h2>
                    <textarea
                        spellCheck="true"
                        value={specTextLeft}
                        name="specs-left"
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div class="spec">
                    <h2>Right</h2>
                    <textarea
                        spellCheck="true"
                        value={specTextRight}
                        name="specs-right"
                        onChange={handleChange}
                    ></textarea>
                </div>
            </div>
            {(specifications && (specifications.left.length > 0 || specifications.right.length > 0)) && (
                <div class="description-preview description-preview--full">
                    <div class="pdp__specs__row">
                        <div class="pdp__specs__row__left">
                            <table class="pdp__specs__row__left__table">
                                <tbody class="pdp__specs__row__left__table__tbody">
                                    {specifications.left && specifications.left.map(s => {
                                        const cells = s.split(":")
                                        let heading = false
                                        if (cells.length === 1) {
                                            cells.push("")
                                            heading = true
                                        }
                                        return (
                                            <tr>
                                                <td class={heading ? "pdp__specs__row--bold pdp__specs__row--green" : "pdp__specs__row--bold"}>
                                                    {cells[0]}
                                                </td>
                                                <td>
                                                    {cells[1]}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div class="pdp__specs__row__right">
                            <table class="pdp__specs__row__right__table">
                                <tbody class="pdp__specs__row__right__table__tbody">
                                    {specifications.right && specifications.right.map(s => {
                                        const cells = s.split(":")
                                        let heading = false
                                        if (cells.length === 1) {
                                            cells.push("")
                                            heading = true
                                        }
                                        return (
                                            <tr>
                                                <td class={heading ? "pdp__specs__row--bold pdp__specs__row--green" : "pdp__specs__row--bold"}>
                                                    {cells[0]}
                                                </td>
                                                <td>
                                                    {cells[1]}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}