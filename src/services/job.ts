import { Job, IJob } from '../models/Job';
import { Website, IWebsite } from '../models/Website';
import * as cheerio from "cheerio";
import {logger} from '../utils/logger';
import { getGeneral } from './general';


export const scanJobs = async (): Promise<void> => {
  try {
    const websites = await Website.find() as IWebsite[];
    const jobs = [];
    const basicKeywords = await getGeneral();
    for (const website of websites) {
      const html = await scanJob(website.url);
      const keywords = [...basicKeywords.keywords, ...website.keywords || []];
      const data = await findDataInHtmlByKeywords(html, keywords);
      const job = { websiteId: website._id as string, data } as IJob;
      jobs.push(job);
    }
    await updateJobs(jobs);
  } catch (error) {
    logger.error('Error scanning jobs:', error);
  }
};



const scanJob = async (websiteUrl: string) => {
  try {
   const response = await fetch(websiteUrl);
   const html = await response.text();
   return html;
  } catch (error) {
    console.log('err');
    throw error;
  }
};


const findDataInHtmlByKeywords = async (html: string, keywords: string[]) => {
  try {
    const $ = cheerio.load(html);
    const results = new Set<string>();

    $("script, style").remove();

    $("*").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 40) return;
      if (!text) return;

      for (const keyword of keywords) {
        if (text.toLowerCase().includes(keyword.toLowerCase())) {
          results.add(text); 
        }
      }
    });

    return Array.from(results); 
  } catch (error) {
    throw error;
  }
};


const updateJobs = async (jobs: IJob[]) => {
  try {
    await Job.deleteMany();
    await Job.create(jobs);
    return { success: true, message: 'Jobs updated successfully' };
  } catch (error) {
    throw error;
  }
};

