import LateralMenuLayer from "#layers/LateralMenuLayer.tsx";

function SearchCases() {
    return (
        <LateralMenuLayer locationId='none' alwaysShowSearch={true}>
            <div>Busqueda</div>
        </LateralMenuLayer>
    );
}
export default SearchCases;
