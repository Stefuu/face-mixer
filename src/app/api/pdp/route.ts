import { gql, request } from "graphql-request";
import { NextResponse } from "next/server";

const GET_DISTINCT_RESPONDENTS_BY_NAME_QUERY = gql`
  query GetDistinctRespondentsByName(
    $input: GetDistinctRespondentsByNameInput!
  ) {
    getDistinctRespondentsByName(input: $input) {
      edges {
        name
        emails
      }
      page
      pageSize
    }
  }
`;

const GET_LATEST_REPORT_BY_EMAIL = gql`
  query GetLatestReportByEmail($input: GetLatestReportByEmailInput!) {
    getLatestReportByEmail(input: $input) {
      email
      report {
        _id
        name
        email
        surveyTakenAt
        reportId
        surveyId
        jobTitle
        communicationStyle {
          naturalCommunicationStyle {
            type
            description
          }
          prefersCommunicating
          prefersOthersCommunicating
        }
        leadershipStyle {
          whenInALeadershipRole
          naturalLeadershipStyle {
            type
            description
          }
        }
        backupStyle {
          type
          description
          additionalExtremeResponses
        }
        motivators
        demotivators
        uniqueTraitPairs {
          type
        }
        basicTraits {
          highestTrait
        }
      }
    }
  }
`;

const GET_LATEST_REPORTS = gql`
  query GetReports($input: GetReportsInput!) {
    getReports(input: $input) {
      edges {
        _id
        name
        email
        surveyTakenAt
        reportId
        surveyId
        jobTitle
        communicationStyle {
          naturalCommunicationStyle {
            type
            description
          }
          prefersCommunicating
          prefersOthersCommunicating
        }
        leadershipStyle {
          whenInALeadershipRole
          naturalLeadershipStyle {
            type
            description
          }
        }
        backupStyle {
          type
          description
          additionalExtremeResponses
        }
        motivators
        demotivators
        uniqueTraitPairs {
          type
        }
        basicTraits {
          highestTrait
        }
      }
      page
      pageSize
    }
  }
`;

async function getLatestReportByEmail({ emails }: { emails: string[] }) {
  const results = [];

  for (const email of emails) {
    results.push(
      await request(
        process.env.NULLSTACK_SETTINGS_PDP_API_URL!,
        GET_LATEST_REPORT_BY_EMAIL,
        {
          input: { email },
        },
        {
          "X-API-Key": process.env.NULLSTACK_SECRETS_PDP_API_KEY!,
        }
      )
    );
  }

  return results
    .sort((reportA: any, reportB: any) => {
      const {
        getLatestReportByEmail: {
          report: { reportId: reportIdA },
        },
      } = reportA;

      const {
        getLatestReportByEmail: {
          report: { reportId: reportIdB },
        },
      } = reportB;

      return reportIdA > reportIdB ? -1 : 1;
    })
    .shift();
}

async function getDistinctRespondentsByName({ name }: { name: string }) {
  const filters = name
    ? {
        filters: {
          name: {
            regex: {
              pattern: String(name),
              options: "mi",
            },
          },
        },
      }
    : {};

  const results = request(
    process.env.NULLSTACK_SETTINGS_PDP_API_URL!,
    GET_DISTINCT_RESPONDENTS_BY_NAME_QUERY,
    {
      input: {
        page: 1,
        pageSize: 5,
        ...filters,
      },
    },
    {
      "X-API-Key": process.env.NULLSTACK_SECRETS_PDP_API_KEY!,
    }
  );

  return await results;
}

const realNames = (name: string) => {
  if (name === "Rhino Bazoli") {
    return "André Bazoli";
  }
  return name;
};

export async function POST(req: any) {
  const { name } = await req.json();

  try {
    const res: any = await request(
      process.env.NULLSTACK_SETTINGS_PDP_API_URL!,
      GET_LATEST_REPORTS,
      {
        input: {
          page: 1,
          pageSize: 5,
          filters: {
            name: {
              regex: {
                pattern: String(realNames(name)),
                options: "mi",
              },
            },
          },
        },
      },
      {
        "X-API-Key": process.env.NULLSTACK_SECRETS_PDP_API_KEY!,
      }
    );
    if (res.getReports.edges.length === 0) {
      return NextResponse.json(
        { message: "No reports found", name: realNames(name) },
        { status: 404 }
      );
    }
    return NextResponse.json(res.getReports.edges[0]);
  } catch (err) {
    console.error("Error at getLatestReportByEmail", err);
  }
}
