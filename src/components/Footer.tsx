export default function Footer() { 
    return (
        <footer className="w-full py-2 text-gray-500">
            &copy; {new Date().getFullYear()} VibeNotes. All rights reserved, Terms of Service, Privacy Policy.
        </footer>
    );
}