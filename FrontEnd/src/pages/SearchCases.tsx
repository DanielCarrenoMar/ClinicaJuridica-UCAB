import LateralMenuLayer from "#layers/LateralMenuLayer.tsx";
import { useSearchParams } from "react-router";

function SearchCases() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q') || '';

    return (
        <LateralMenuLayer locationId='none' alwaysShowSearch={true} defaultSearchText={q}>
            <div>{q}</div>
        </LateralMenuLayer>
    );
}
export default SearchCases;
