// Arbitrarily nested data
const toppingOptions = [
    {
        name: "Pepperoni",
        id: "pepperoni-id",
        subOptions: [
            {
                name: "Spicy",
                id: "spicy-id",
                subOptions: []
            },
            {
                name: "Regular",
                id: "regular-id",
                subOptions: []
            }
        ]
    },
    {
        name: "Chicken",
        id: "chicken-id",
        subOptions: [
            {
                name: "Buffalo",
                id: "buffalo-id",
                subOptions: [
                    {
                        name: "Mild",
                        id: 'mild-id',
                        subOptions: [],
                    },
                    {
                        name: "Hot",
                        id: 'hot-id',
                        subOptions: [
                            {
                                name: 'Jalapeño',
                                id: 'jalapeno-id',
                                subOptions: []
                            },
                            {
                                name: 'Cayenne',
                                id: 'cayenne-id',
                                subOptions: []
                            }
                        ],
                    },
                ]
            },
            {
                name: "BBQ",
                id: 'bbq-id',
                subOptions: [],
            }
        ]
    },
]

// Recursive component
export const OptionsList = ({ options, selectedOptions, onChange }) => {

    const handleCheckboxClicked = (selectedOptionId) => {
        // is currently selected
        if (selectedOptions[selectedOptionId]) {
            // remove selected key from options list
            delete selectedOptions[selectedOptionId];
        } else { // is not currently selected
            // Add selected key to optionsList
            selectedOptions[selectedOptionId] = {}
        }
        // call onChange function given by parent
        onChange(selectedOptions)
    }

    const handleSubOptionsListChange = (optionId, subSelections) => {
        // add sub selections to current optionId
        selectedOptions[optionId] = subSelections;
        // call onChange function given by parent
        onChange(selectedOptions);
    }

    return (
        <div>
            {options.map(option => (
                <ul>
                    <Checkbox
                        selected={selectedOptions[option.id]}
                        label={option.name}
                        onChange={() => { handleCheckboxClicked(option.id) }}
                    />
                    {/* Base Case */}
                    {(option.subOptions.length > 0 && selectedOptions[option.id]) &&
                        <OptionsList
                            options={option.subOptions}
                            selectedOptions={selectedOptions[option.id]}
                            onChange={(subSelections) => handleSubOptionsListChange(option.id, subSelections)}
                        />
                    }
                </ul>
            ))}
        </div>
    )
}

// Dumb checkbox component, completly controlled by parent
const Checkbox = ({ selected, label, onChange }) => {
    return (
        <div>
            <div
                className="checkbox"
                onClick={() => onChange(!selected)}
            />
            <div className="label">{label}</div>
        </div>
    )
}

