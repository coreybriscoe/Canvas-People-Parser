import { readFileSync } from 'fs';
import { resolve } from 'path';
import { GradingAssignmentsData, Section, Instructor, Student } from './types';
import gradingAssignments from './gradingassignments/gradingAssignments';
import groupGradingAssignments from './groupgradingassignments/groupGradingAssignments';

interface ProgramModes {
	[key: number]: Function;
}

// Program modes:
const programModes: ProgramModes = { 
	1: gradingAssignments,
	2: groupGradingAssignments
}

// get user input options at runtime
const prompt = require('prompt-sync')({sigint: true});
const mode = prompt('Choose program mode:\n1. Grading Assignments\n2. Group Grading Assignments\n') as number;

if (!programModes[mode]) throw new Error('Invalid mode');

(programModes[mode] as Function)();