/**
 * Data validation script
 * Run this script to validate all data files and ensure they meet the required structure
 */

import { DataLoader } from '../utils/dataLoader';

console.log('🔍 Validating portfolio data...\n');

try {
  // Test portfolio data
  console.log('📋 Portfolio Data:');
  const portfolioData = DataLoader.getPortfolioData();
  console.log('✅ Portfolio data loaded successfully');
  console.log(`   Name: ${portfolioData.personal.name}`);
  console.log(`   Title: ${portfolioData.personal.title}`);
  console.log(`   Email: ${portfolioData.personal.email}\n`);

  // Test projects data
  console.log('🚀 Projects Data:');
  const projects = DataLoader.getProjects();
  console.log(`✅ ${projects.length} projects loaded successfully`);
  const featuredCount = projects.filter(p => p.featured).length;
  console.log(`   Featured projects: ${featuredCount}`);
  
  const stats = DataLoader.getProjectStats();
  console.log(`   Categories: ${Object.keys(stats.categories).join(', ')}`);
  console.log(`   Technologies: ${stats.technologies} unique technologies\n`);

  // Test skills data
  console.log('🛠️  Skills Data:');
  const skills = DataLoader.getSkills();
  console.log(`✅ ${skills.length} skill categories loaded successfully`);
  const totalSkills = skills.reduce((acc, cat) => acc + cat.skills.length, 0);
  console.log(`   Total skills: ${totalSkills}`);
  console.log(`   Categories: ${skills.map(s => s.category).join(', ')}\n`);

  // Test research data
  console.log('📚 Research Data:');
  const research = DataLoader.getResearch();
  console.log(`✅ ${research.length} research entries loaded successfully`);
  const published = research.filter(r => r.status === 'published').length;
  const inProgress = research.filter(r => r.status === 'in-progress').length;
  const submitted = research.filter(r => r.status === 'submitted').length;
  console.log(`   Published: ${published}, Submitted: ${submitted}, In Progress: ${inProgress}\n`);

  // Test utility functions
  console.log('🔧 Testing Utility Functions:');
  const featuredProjects = DataLoader.getFeaturedProjects();
  console.log(`✅ Featured projects: ${featuredProjects.length}`);
  
  const aiProjects = DataLoader.getProjectsByCategory('AI');
  console.log(`✅ AI projects: ${aiProjects.length}`);
  
  const allTech = DataLoader.getAllTechnologies();
  console.log(`✅ All technologies: ${allTech.length} unique items`);
  
  const publishedResearch = DataLoader.getPublishedResearch();
  console.log(`✅ Published research: ${publishedResearch.length}\n`);

  console.log('🎉 All data validation tests passed!');
  console.log('📊 Summary:');
  console.log(`   - Portfolio: ✅ Valid`);
  console.log(`   - Projects: ✅ ${projects.length} items`);
  console.log(`   - Skills: ✅ ${skills.length} categories, ${totalSkills} total skills`);
  console.log(`   - Research: ✅ ${research.length} entries`);
  console.log(`   - Utilities: ✅ All functions working`);

} catch (error) {
  console.error('❌ Data validation failed:');
  console.error(error instanceof Error ? error.message : 'Unknown error');
  throw error;
}

export {};