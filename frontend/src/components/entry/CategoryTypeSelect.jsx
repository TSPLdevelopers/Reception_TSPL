import { FaBuilding } from "react-icons/fa";
import SearchableSelect from "../ui/SearchableSelect";
import FormField from "../ui/FormField";
import {
    getOtherVisitorType,
    getVisitorTypeOptions
} from "../../constants/visitorTypes";

function CategoryTypeSelect({ category, formData, setFormData }) {
    const options = getVisitorTypeOptions(category);
    const otherOption = getOtherVisitorType(category);
    const isOtherSelected = formData.typeOption === otherOption;

    const handleTypeChange = (option) => {
        setFormData({
            ...formData,
            typeOption: option.value,
            type: option.value === otherOption ? formData.otherType : option.value
        });
    };

    return (
        <>
            <SearchableSelect
                label={`${category.charAt(0).toUpperCase()}${category.slice(1)} Type`}
                value={formData.typeOption}
                options={options}
                onChange={handleTypeChange}
                placeholder="Select visitor type"
                icon={FaBuilding}
            />

            {isOtherSelected && (
                <FormField
                    label="Please Specify Type"
                    icon={FaBuilding}
                    value={formData.otherType}
                    onChange={(otherType) =>
                        setFormData({
                            ...formData,
                            otherType,
                            type: otherType
                        })
                    }
                    placeholder="Enter visitor type"
                    required
                    className="mt-4"
                />
            )}
        </>
    );
}

export default CategoryTypeSelect;
