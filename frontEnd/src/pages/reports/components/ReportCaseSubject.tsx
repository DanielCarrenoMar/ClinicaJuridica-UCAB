import {
  Text,
  View,
} from "@react-pdf/renderer";
import { styleDocument } from "./ReportDocument";

function ReportCaseSubject() {
  return (
    <>
        <Text style={styleDocument.title}>Hello world</Text>
        <View style={styleDocument.section}>
          <Text>
            Waza
          </Text>
        </View>
        <Text style={styleDocument.parragraph}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, totam explicabo quam officiis illo optio eum distinctio nihil in quidem delectus ex expedita voluptatibus. Est nobis ex beatae doloribus illum, autem maiores pariatur ea sed soluta nesciunt debitis corporis. Soluta, quis dolor deleniti quibusdam iste eveniet aliquid minus dolorem, molestias natus quam quo labore repellendus! Saepe magni doloribus suscipit quas consectetur velit facere dolorem culpa? Eveniet nihil quo accusamus. Numquam vero quos nobis veniam sequi, nihil earum voluptatibus aliquam id tempora non suscipit beatae, quo distinctio totam repellendus recusandae optio ex? Qui maxime veritatis quaerat esse nam repellendus sed, tempora, illum aliquam dolorum praesentium soluta excepturi fuga, minus consequatur suscipit. Cumque odio sapiente molestiae non, fugit culpa dolore aspernatur ea placeat suscipit reprehenderit rerum quia, fugiat ex, sequi sunt autem totam eius delectus! Eos beatae incidunt, recusandae rem possimus repellat architecto ipsa obcaecati reprehenderit quia magni dignissimos quae? Excepturi, sed culpa quo autem ipsum nobis hic recusandae modi facere optio provident odit corporis tempora voluptatum facilis earum qui laboriosam? Quisquam blanditiis consequuntur nam! Reprehenderit explicabo illo, mollitia non cumque sunt sapiente aut esse laborum quis excepturi saepe architecto ipsum repudiandae quasi beatae necessitatibus neque facere laboriosam fugit? Officia, illo officiis!
        </Text>

        <View style={styleDocument.pageNumber}>
            <Text render={({pageNumber, totalPages}) => `${pageNumber}/${totalPages}`} />
        </View>
    </>
  );
}

export default ReportCaseSubject;