/**
 * Project Storage Utility
 * Handles local storage and management of PAAM projects
 */

import { PAAMProject } from '@/components/copilot-assistant/paam-copilot-assistant';

export interface ProjectStorage {
  saveProject: (project: PAAMProject) => void;
  archiveProject: (projectId: string) => boolean;
  loadProject: (projectId: string) => PAAMProject | null;
  getAllProjects: () => PAAMProject[];
  deleteProject: (projectId: string) => boolean;
}

// In-memory storage for development
// In production, this would be replaced with a proper database
const projects: Map<string, PAAMProject> = new Map();

export const projectStorage: ProjectStorage = {
  /**
   * Save a project to storage
   */
  saveProject: (project: PAAMProject) => {
    project.updatedAt = new Date();
    projects.set(project.id, project);
    
    // Also save to localStorage for persistence
    try {
      const projectsArray = Array.from(projects.values());
      localStorage.setItem('paam-projects', JSON.stringify(projectsArray));
    } catch (error) {
      console.error('Failed to save projects to localStorage:', error);
    }
  },

  /**
   * Archive a project
   */
  archiveProject: (projectId: string): boolean => {
    const project = projects.get(projectId);
    if (!project) {
      return false;
    }

    project.status = 'archived';
    project.updatedAt = new Date();
    projects.set(projectId, project);

    // Update localStorage
    try {
      const projectsArray = Array.from(projects.values());
      localStorage.setItem('paam-projects', JSON.stringify(projectsArray));
    } catch (error) {
      console.error('Failed to update projects in localStorage:', error);
    }

    return true;
  },

  /**
   * Load a specific project by ID
   */
  loadProject: (projectId: string): PAAMProject | null => {
    // First check in-memory storage
    if (projects.has(projectId)) {
      return projects.get(projectId) || null;
    }

    // If not in memory, try to load from localStorage
    try {
      const stored = localStorage.getItem('paam-projects');
      if (stored) {
        const projectsArray = JSON.parse(stored);
        const project = projectsArray.find((p: PAAMProject) => p.id === projectId);
        if (project) {
          // Convert date strings back to Date objects
          project.createdAt = new Date(project.createdAt);
          project.updatedAt = new Date(project.updatedAt);
          project.deploymentHistory = project.deploymentHistory?.map((dep: any) => ({
            ...dep,
            lastDeployed: dep.lastDeployed ? new Date(dep.lastDeployed) : undefined
          })) || [];
          
          // Add to in-memory storage
          projects.set(projectId, project);
          return project;
        }
      }
    } catch (error) {
      console.error('Failed to load projects from localStorage:', error);
    }

    return null;
  },

  /**
   * Get all projects
   */
  getAllProjects: (): PAAMProject[] => {
    // First check in-memory storage
    if (projects.size > 0) {
      return Array.from(projects.values());
    }

    // If no projects in memory, try to load from localStorage
    try {
      const stored = localStorage.getItem('paam-projects');
      if (stored) {
        const projectsArray = JSON.parse(stored);
        // Convert date strings back to Date objects
        const convertedProjects = projectsArray.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
          deploymentHistory: project.deploymentHistory?.map((dep: any) => ({
            ...dep,
            lastDeployed: dep.lastDeployed ? new Date(dep.lastDeployed) : undefined
          })) || []
        }));

        // Add to in-memory storage
        convertedProjects.forEach((project: PAAMProject) => {
          projects.set(project.id, project);
        });

        return convertedProjects;
      }
    } catch (error) {
      console.error('Failed to load projects from localStorage:', error);
    }

    return [];
  },

  /**
   * Delete a project
   */
  deleteProject: (projectId: string): boolean => {
    const deleted = projects.delete(projectId);
    
    if (deleted) {
      // Update localStorage
      try {
        const projectsArray = Array.from(projects.values());
        localStorage.setItem('paam-projects', JSON.stringify(projectsArray));
      } catch (error) {
        console.error('Failed to update projects in localStorage:', error);
      }
    }

    return deleted;
  }
};

// Initialize storage from localStorage on module load
try {
  const stored = localStorage.getItem('paam-projects');
  if (stored) {
    const projectsArray = JSON.parse(stored);
    const convertedProjects = projectsArray.map((project: any) => ({
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
      deploymentHistory: project.deploymentHistory?.map((dep: any) => ({
        ...dep,
        lastDeployed: dep.lastDeployed ? new Date(dep.lastDeployed) : undefined
      })) || []
    }));

    convertedProjects.forEach((project: PAAMProject) => {
      projects.set(project.id, project);
    });
  }
} catch (error) {
  console.error('Failed to initialize project storage:', error);
}