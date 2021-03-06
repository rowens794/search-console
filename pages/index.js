import Head from "next/head";

export default function Home() {
  const handleClick = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/get-search-console-data`,
      {
        method: "POST", // or 'PUT'
        headers: {},
      }
    );

    const json = await res.json();
  };

  const handleCalc = async () => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/calc`, {
      method: "POST", // or 'PUT'
      headers: {},
    });

    const json = await res.json();
  };

  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-6xl mx-auto mt-12">
        <h1 className="">Get Search Console Data</h1>

        <p
          className="hover:text-blue-700 underline cursor-pointer"
          onClick={handleClick}
        >
          Get Console Data
        </p>

        <p
          className="hover:text-blue-700 underline cursor-pointer"
          onClick={handleCalc}
        >
          Calculate
        </p>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  let body = JSON.stringify({});

  // let res = fetch(
  //   `${process.env.NEXT_PUBLIC_API}/api/get-search-console-data`,
  //   {
  //     method: "POST", // or 'PUT'
  //     headers: {},
  //     body: body,
  //   }
  // );

  return {
    props: {
      data: null,
    },
  };
}
