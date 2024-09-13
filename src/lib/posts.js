import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'data', 'md')

export function getSortedPostsData() {
  // Get file names under /data/md
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      title: matterResult.data.title,
      description: matterResult.data.description,
      date: matterResult.data.date,
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export async function getPostData(slug) {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = await fs.promises.readFile(fullPath, 'utf8');

    // 使用 gray-matter 解析文章元数据部分
    const matterResult = matter(fileContents);

    // 使用 remark 将 markdown 转换为 HTML 字符串
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // 将数据与 slug 和 contentHtml 组合
    return {
      slug,
      contentHtml,
      ...matterResult.data
    };
  } catch (error) {
    console.error(`Error processing post ${slug}:`, error);
    throw error;
  }
}

export async function getPostData2(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}