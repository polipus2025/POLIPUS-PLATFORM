// Debugging script to check for duplicate sidebar elements
console.log("=== RADICAL SIDEBAR DEBUG ===");
console.log("ExporterSidebar components on page:", document.querySelectorAll('[class*="w-64"], [class*="sidebar"], [class*="navigation"]').length);
console.log("Flex containers:", document.querySelectorAll('.flex').length);
console.log("Elements with 'w-64' class:", document.querySelectorAll('.w-64').length);
console.log("All elements with width classes:", document.querySelectorAll('[class*="w-"]').length);

// Check for any hidden or overlapping sidebars
const allSidebars = document.querySelectorAll('[class*="w-64"], [class*="sidebar"]');
allSidebars.forEach((sidebar, i) => {
  console.log(`Sidebar ${i+1}:`, sidebar.className, sidebar.getBoundingClientRect());
});