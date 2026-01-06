import { useRefinementList } from 'react-instantsearch-hooks-web';
import { Checkbox, Label } from "@medusajs/ui"

const RefinementList = ({ attribute, sortBy }: { attribute: string, sortBy?: any }) => {
    const { items, refine } = useRefinementList({ attribute, sortBy });

    return (
        <div className="flex flex-col gap-y-2">
            <h3 className="text-small-semi text-ui-fg-base mb-2 uppercase">{attribute}</h3>
            {items.length === 0 && <span className="text-ui-fg-muted text-small-regular">No filters available</span>}
            {items.map((item) => (
                <div key={item.label} className="flex items-center gap-x-2">
                    <Checkbox
                        id={`filter-${attribute}-${item.label}`}
                        checked={item.isRefined}
                        onCheckedChange={() => refine(item.value)}
                    />
                    <Label htmlFor={`filter-${attribute}-${item.label}`} className="text-ui-fg-base text-small-regular cursor-pointer">
                        {item.label} <span className="text-ui-fg-muted">({item.count})</span>
                    </Label>
                </div>
            ))}
        </div>
    );
};

export default RefinementList;
