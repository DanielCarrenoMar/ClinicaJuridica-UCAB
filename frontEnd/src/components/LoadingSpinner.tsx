export default function LoadingSpinner() {
    return <span
        className="inline-block h-4 w-4 animate-spin-clockwise animate-iteration-count-infinite rounded-full border-2 border-current border-r-transparent"
        aria-hidden="true"
    />
}