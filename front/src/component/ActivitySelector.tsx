import '../view/Form.view.css';

function ActivitySelector() {
    const activities = {
        "ecclésiastique": { "chrétien": { "catholique": { "prêtre": null, "évêque": null }, "protestant": null, "orthodoxe": null, "preSchisme": null } },
        "scientifique": { "médecin": null, "astronome": null, "mathématicien": null },
        "intellectuel non scientifique": { "historien": null, },
        "artiste": {"peintre": null},
        "politicien": null,
        "militaire": null,
        "justice": null,
        "autre": null
    }
    const MAX_LEVEL = 4;
    const format = (count: number): null[] => {
        let res = [];
        for (let i = 0; i < count; i++) res.push(null);
        return res;
    }
    type TableElementsContent = (string | null)[][];
    const computeTableContent = (tableElements: TableElementsContent, level: number, maxLevel: 4, activities: Record<string, any>): TableElementsContent => {
        for (const [index, [key, values]] of Object.entries(Object.entries(activities))) {
            console.log(`${index} - ${level} - ${key} - ${values}`)
            console.log(JSON.stringify(tableElements))
            if (values !== null) tableElements = computeTableContent([...tableElements.slice(0, -1), [...tableElements[tableElements.length - 1], key]], level + 1, maxLevel, values)
            else tableElements =  [...tableElements.slice(0, -1), [...(Number(index) ? format(level - 1) : [...tableElements[tableElements.length - 1]]), key], []];
        }
        return tableElements;
    }

    const formatTableContent = (gridTemplateAreas: TableElementsContent) => {
        return <tbody>
            {
                gridTemplateAreas.map(line => 
                    <tr>
                        {
                            line.map(e => { 
                                if (e === null) return <td></td>
                                else return <td>{e}</td>
                            })
                        }
                    </tr>
                )
            }
        </tbody>;
    }
    return (
        <table>
            <thead>
                <tr>
                    <th>Level 1</th>
                    <th>Level 2</th>
                    <th>Level 3</th>
                    <th>Level 4</th>
                </tr>
            </thead>
            {formatTableContent(computeTableContent([[]], 1, MAX_LEVEL, activities))}
        </table>
    );
}

export default ActivitySelector;