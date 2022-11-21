export default function format_time(seconds) {
    const minutes = (seconds - (seconds % 60)) / 60;

    seconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}min ${String(seconds).padStart(
        2,
        "0"
    )}secs`;
}
