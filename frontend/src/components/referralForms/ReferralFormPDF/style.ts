import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        backgroundColor: "#FFFFFF",
        color: "#262626",
        fontFamily: "Helvetica",
        fontSize: "12px",
        padding: "60px 50px",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
        fontSize: "16px",
        fontFamily: "Helvetica-Bold",
    },
    title: {
        fontSize: "20px",
        fontFamily: "Helvetica-Bold",
    },
    boldText: {
        fontFamily: "Helvetica-Bold"
    }
});
